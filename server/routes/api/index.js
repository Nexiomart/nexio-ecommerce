
const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const addressRoutes = require('./address');
const newsletterRoutes = require('./newsletter');
const productRoutes = require('./product');
const categoryRoutes = require('./category');
const brandRoutes = require('./brand');
const contactRoutes = require('./contact');
const merchantRoutes = require('./merchant');
const manufacturerRoutes = require('./manufacturer');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const reviewRoutes = require('./review');
const wishlistRoutes = require('./wishlist');
const growthpartnerRoutes = require('./growthPartner');
const locationRoutes = require('./location');
const paymentRoutes = require('./payment'); // ✅ NEW
const subscriptionRoutes = require('./subscription');
const supportTicketRoutes = require('./supportTicket');
const registerNoPayRoutes = require('./subscription.register-nopay');
// auth routes
router.use('/auth', authRoutes);

// user routes
router.use('/user', userRoutes);

// address routes
router.use('/address', addressRoutes);

// newsletter routes
router.use('/newsletter', newsletterRoutes);

// product routes
router.use('/product', productRoutes);

// category routes
router.use('/category', categoryRoutes);

// brand routes
router.use('/brand', brandRoutes);

// contact routes
router.use('/contact', contactRoutes);

// merchant routes
router.use('/merchant', merchantRoutes);

// manufacturer routes
router.use('/manufacturer', manufacturerRoutes);

// location routes
router.use('/location', locationRoutes);

 // growth partner routes
router.use('/growthPartner', growthpartnerRoutes);

// cart routes
router.use('/cart', cartRoutes);

// order routes
router.use('/order', orderRoutes);

// payment routes
router.use('/payment', paymentRoutes);

// Review routes
router.use('/review', reviewRoutes);

// registration without payment
router.use('/', registerNoPayRoutes);


// Wishlist routes
router.use('/wishlist', wishlistRoutes);

// Subscription routes
router.use('/subscription', subscriptionRoutes);

// support ticket routes
router.use('/support-ticket', supportTicketRoutes);

module.exports = router;





// const router = require('express').Router();

// const authRoutes = require('./auth');
// const userRoutes = require('./user');
// const addressRoutes = require('./address');
// const newsletterRoutes = require('./newsletter');
// const productRoutes = require('./product');
// const categoryRoutes = require('./category');
// const brandRoutes = require('./brand');
// const contactRoutes = require('./contact');
// const merchantRoutes = require('./merchant');
// const cartRoutes = require('./cart');
// const orderRoutes = require('./order');
// const reviewRoutes = require('./review');
// const wishlistRoutes = require('./wishlist');
// const growthPartnerRoutes = require('./growthPartner'); // ✅ NEW

// // auth routes
// router.use('/auth', authRoutes);

// // user routes
// router.use('/user', userRoutes);

// // address routes
// router.use('/address', addressRoutes);

// // newsletter routes
// router.use('/newsletter', newsletterRoutes);

// // product routes
// router.use('/product', productRoutes);

// // category routes
// router.use('/category', categoryRoutes);

// // brand routes
// router.use('/brand', brandRoutes);

// // contact routes
// router.use('/contact', contactRoutes);

// // merchant routes
// router.use('/merchant', merchantRoutes);

// // growth partner routes
// router.use('/growth-partner', growthPartnerRoutes); // ✅ NEW

// // cart routes
// router.use('/cart', cartRoutes);

// // order routes
// router.use('/order', orderRoutes);

// // Review routes
// router.use('/review', reviewRoutes);

// // Wishlist routes
// router.use('/wishlist', wishlistRoutes);

// module.exports = router;

