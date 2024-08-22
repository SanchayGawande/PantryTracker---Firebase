"use client";
import { Box, Typography, Stack, Button, Modal, TextField, Card, CardContent, CardActions, IconButton, Snackbar, Slide } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = createTheme({
    palette: {
      primary: {
        main: '#0288d1',
      },
      secondary: {
        main: '#d32f2f',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h2: {
        fontWeight: 600,
        color: '#0288d1',
      },
      h5: {
        fontWeight: 500,
        color: '#333333',
      },
      body1: {
        fontSize: '1.1rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, '1'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleOpen = () => {
    setItem("");
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, '1'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity || 0;
      await setDoc(docRef, { quantity: currentQuantity + 1 }, { merge: true });
      setSnackbarMessage(`${item} quantity increased to ${currentQuantity + 1}`);
    } else {
      await setDoc(docRef, { quantity: 1 });
      setSnackbarMessage(`${item} added to pantry with quantity 1`);
    }

    setOpen(false);
    updatePantry();
    setSnackbarOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      addItem(item);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, '1'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity || 0;
      if (currentQuantity > 1) {
        await setDoc(docRef, { quantity: currentQuantity - 1 }, { merge: true });
        setSnackbarMessage(`${item} quantity decreased to ${currentQuantity - 1}`);
      } else {
        await deleteDoc(docRef);
        setSnackbarMessage(`${item} removed from pantry`);
      }
    }

    updatePantry();
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        bgcolor="background.default"
        p={3}
      >
        <Typography variant="h2" textAlign="center" gutterBottom>
          Pantry Items
        </Typography>
        <Box mb={3}>
          <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
            Add Item
          </Button>
        </Box>
        <Stack 
          width="100%"
          maxWidth="800px"
          spacing={3}
          overflow="auto"
          border="none" 
        >
          {pantry.length > 0 ? (
            pantry.map((item) => (
              <Card key={item.id} sx={{ boxShadow: 3, borderRadius: theme.shape.borderRadius }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5">
                    {item.id.charAt(0).toUpperCase() + item.id.slice(1)} - Quantity: {item.quantity}
                  </Typography>
                  <CardActions>
                    <IconButton color="primary" onClick={() => addItem(item.id)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => removeItem(item.id)}>
                      <RemoveIcon />
                    </IconButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" textAlign="center">
              No items found in the pantry.
            </Typography>
          )}
        </Stack>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5">
              Add Item
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Item Name"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Save
              </Button>
            </form>
          </Box>
        </Modal>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          TransitionComponent={(props) => <Slide {...props} direction="up" />}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </ThemeProvider>
  );
}

// Define the style for the modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
