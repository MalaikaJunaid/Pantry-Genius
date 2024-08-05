'use client';
import { useState, useEffect } from 'react';
import { firestore, storage } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Grid, Paper, IconButton, InputAdornment, Alert, Badge, Popover } from '@mui/material';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

const ImgContainer = styled(Box)({
  width: '100%',
  height: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

const Img = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const CardContainer = styled(Paper)({
  height: '300px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const NotificationBadge = styled(Badge)({
  position: 'absolute',
  top: 8,
  right: 8,
});

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [minExpiry, setMinExpiry] = useState('');
  const [maxExpiry, setMaxExpiry] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // Renamed from 'open'
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemExpiry, setItemExpiry] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const categories = ['Fruit', 'Vegetable', 'Dairy', 'Meat', 'Grain', 'Bakery', 'Other'];

  const updatePantry = async () => {
    const snapshot = collection(firestore, 'inventory');
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setPantry(inventoryList);
    setFilteredPantry(inventoryList);
  };

  const addItem = async () => {
    if (!itemCategory) {
      setNotifications(prev => [...prev, { id: Date.now(), type: 'error', message: 'Please select a category!' }]);
      return;
    }
    if (itemCategory !== 'Other' && !itemExpiry) {
      setNotifications(prev => [...prev, { id: Date.now(), type: 'error', message: 'Expiry date is required for all categories except "Other".' }]);
      return;
    }
    if (itemCategory !== 'Other' && new Date(itemExpiry) < new Date()) {
      setNotifications(prev => [...prev, { id: Date.now(), type: 'error', message: 'Expiry date cannot be before the current date.' }]);
      return;
    }
    if (!itemImage) {
      setNotifications(prev => [...prev, { id: Date.now(), type: 'error', message: 'Please upload an image!' }]);
      return;
    }

    try {
      const imageRef = ref(storage, `inventory/${itemName}/${itemImage.name}`);
      await uploadBytes(imageRef, itemImage);
      const imageUrl = await getDownloadURL(imageRef);
      const itemData = {
        quantity: itemQuantity,
        expiryDate: itemExpiry,
        category: itemCategory,
        imageUrl: imageUrl,
      };
      const docRef = doc(collection(firestore, 'inventory'), itemName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        await setDoc(docRef, {
          ...existingData,
          quantity: existingData.quantity + itemQuantity,
          ...itemData
        }, { merge: true });
      } else {
        await setDoc(docRef, itemData);
      }
      setItemName('');
      setItemQuantity(1);
      setItemExpiry('');
      setItemCategory('');
      setItemImage(null);
      handleClose();
      await updatePantry();
      setNotifications(prev => [...prev, { id: Date.now(), type: 'success', message: 'Item successfully added!' }]);
    } catch (error) {
      console.error('Failed to upload image or update Firestore', error);
    }
  };

  const updateItemQuantity = async (itemId, amount) => {
    const docRef = doc(collection(firestore, 'inventory'), itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const itemData = docSnap.data();
      const newQuantity = Math.max(itemData.quantity + amount, 0);
      if (newQuantity > 0) {
        await setDoc(docRef, { quantity: newQuantity }, { merge: true });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updatePantry();
  };

  const removeItem = async (itemId) => {
    const docRef = doc(collection(firestore, 'inventory'), itemId);
    await deleteDoc(docRef);
    await updatePantry();
  };

  const handleSearch = () => {
    let filtered = pantry;

    if (filterType === 'name') {
      filtered = pantry.filter(item =>
        item.id.toLowerCase().includes(searchText.toLowerCase())
      );
    } else if (filterType === 'category') {
      filtered = pantry.filter(item =>
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    } else if (filterType === 'quantity') {
      filtered = pantry.filter(item =>
        (minQuantity ? item.quantity >= minQuantity : true) &&
        (maxQuantity ? item.quantity <= maxQuantity : true)
      );
    } else if (filterType === 'expiry') {
      filtered = pantry.filter(item =>
        (minExpiry ? new Date(item.expiryDate) >= new Date(minExpiry) : true) &&
        (maxExpiry ? new Date(item.expiryDate) <= new Date(maxExpiry) : true)
      );
    } else {
      filtered = pantry.filter(item =>
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredPantry(filtered);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    const now = new Date();
    const newNotifications = [];
    pantry.forEach((item) => {
      const expiryDate = new Date(item.expiryDate);
      const daysToExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
      if (daysToExpiry <= 3 && daysToExpiry >= 0) {
        newNotifications.push({ id: item.id + '-expiry', type: 'warning', message: `Item "${item.id}" is expiring soon in ${daysToExpiry} days!` });
      }
      if (item.quantity <= 4 && item.quantity > 0) {
        newNotifications.push({ id: item.id + '-quantity', type: 'info', message: `Item "${item.id}" is about to end! Only ${item.quantity} left.` });
      }
    });
    setNotifications(prev => [...prev, ...newNotifications]);
  }, [pantry]);

  const handleOpenNotifications = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const notificationOpen = Boolean(notificationAnchorEl);
  const notificationId = notificationOpen ? 'notification-popover' : undefined;

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setItemImage(acceptedFiles[0]);
    }
  });

  const formatItemName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '600px', backgroundColor: 'background.paper', boxShadow: 24, p: 4 }}
        >
          <Typography variant="h6" component="h2" id="modal-title">Add Item</Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            />
            <TextField
              label="Expiry Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={itemExpiry}
              onChange={(e) => setItemExpiry(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box {...getRootProps()} sx={{ border: '1px dashed grey', padding: '10px', textAlign: 'center' }}>
              <input {...getInputProps()} />
              {itemImage ? <Img src={URL.createObjectURL(itemImage)} alt="Item Image" /> : 'Drag & drop an image here, or click to select one'}
            </Box>
            <Button variant="contained" color="primary" onClick={addItem}>Add Item</Button>
          </Stack>
        </Box>
      </Modal>

      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Pantry Inventory</Typography>
        <Stack direction="row" spacing={2} mb={2} alignItems="center">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl>
            <InputLabel>Filter By</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter By"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="expiry">Expiry Date</MenuItem>
            </Select>
          </FormControl>
          {filterType === 'quantity' && (
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Quantity"
                type="number"
                variant="outlined"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
              />
              <TextField
                label="Max Quantity"
                type="number"
                variant="outlined"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
              />
            </Stack>
          )}
          {filterType === 'expiry' && (
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Expiry Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={minExpiry}
                onChange={(e) => setMinExpiry(e.target.value)}
              />
              <TextField
                label="Max Expiry Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={maxExpiry}
                onChange={(e) => setMaxExpiry(e.target.value)}
              />
            </Stack>
          )}
          <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>Add Item</Button>
        </Stack>
        <Grid container spacing={2}>
          {filteredPantry.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <CardContainer>
                <ImgContainer>
                  <Img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.id} />
                </ImgContainer>
                <Typography variant="h6">{formatItemName(item.id)}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <Typography>Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}</Typography>
                <Typography>Category: {item.category}</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => updateItemQuantity(item.id, 1)}><AddIcon /></IconButton>
                  <IconButton onClick={() => updateItemQuantity(item.id, -1)}><RemoveIcon /></IconButton>
                  <IconButton onClick={() => removeItem(item.id)}><DeleteIcon /></IconButton>
                </Stack>
              </CardContainer>
            </Grid>
          ))}
        </Grid>
      </Container>

      <IconButton
        size="large"
        color="inherit"
        aria-label="notifications"
        onClick={handleOpenNotifications}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <NotificationBadge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </NotificationBadge>
      </IconButton>
      <Popover
        id={notificationId}
        open={notificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Stack spacing={2} p={2}>
          {notifications.map(notification => (
            <Alert
              key={notification.id}
              severity={notification.type}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleDismissNotification(notification.id)}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              {notification.message}
            </Alert>
          ))}
        </Stack>
      </Popover>
    </Box>
  );
}
