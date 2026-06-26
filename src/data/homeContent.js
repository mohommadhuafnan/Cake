export const announcements = [
  { id: 1, text: { en: '🎉 WELCOME10 — Get 10% off your first order!', ar: '🎉 WELCOME10 — خصم 10% على طلبك الأول!' } },
  { id: 2, text: { en: '🚚 Free delivery on orders above QAR 300', ar: '🚚 توصيل مجاني للطلبات فوق 300 ر.ق' } },
  { id: 3, text: { en: '✨ Ramadan Collection now available — Order today!', ar: '✨ مجموعة رمضان متوفرة الآن — اطلب اليوم!' } },
]

export const categoryNav = [
  { id: 'wedding', label: { en: 'Wedding Cakes', ar: 'كيك الأعراس' } },
  { id: 'birthday', label: { en: 'Birthday', ar: 'أعياد ميلاد' } },
  { id: 'corporate', label: { en: 'Corporate', ar: 'شركات' } },
  { id: 'seasonal', label: { en: 'Seasonal', ar: 'موسمي' } },
  { id: 'custom', label: { en: 'Custom Order', ar: 'طلب مخصص' }, link: 'custom' },
  { id: 'all', label: { en: 'All Cakes', ar: 'جميع الكيك' } },
]

export const showcaseCategories = [
  {
    id: 'signature',
    title: { en: 'Signature Cakes', ar: 'كيك التوقيع' },
    subtitle: { en: 'Our finest handcrafted masterpieces', ar: 'تحفنا الحرفية الأ finest' },
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    bg: 'bg-[#FFF8E7]',
    link: 'shop?category=wedding',
  },
  {
    id: 'celebration',
    title: { en: 'Celebration Cakes', ar: 'كيك الاحتفالات' },
    subtitle: { en: 'Perfect for every special moment', ar: 'مثالي لكل لحظة خاصة' },
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80',
    bg: 'bg-blush',
    link: 'shop?category=birthday',
  },
  {
    id: 'slices',
    title: { en: 'Cake Slices & Bites', ar: 'شرائح الكيك' },
    subtitle: { en: 'Indulgent portions, same luxury taste', ar: 'حصص فاخرة، نفس الطعم الراقي' },
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    bg: 'bg-[#FDF0E8]',
    link: 'shop',
  },
]

export const specialOffers = [
  {
    id: 'custom',
    title: { en: 'Create Your Own Cake', ar: 'صمم كيكك الخاص' },
    cta: { en: 'Shop Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80',
    bg: 'from-[#E8F4FD] to-[#D4E9F7]',
    link: 'custom',
  },
  {
    id: 'photo',
    title: { en: 'Photo Cake', ar: 'كيك بالصورة' },
    cta: { en: 'Shop Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f54a55?w=500&q=80',
    bg: 'from-blush to-[#F5D5DA]',
    link: 'custom',
  },
  {
    id: 'dream',
    title: { en: 'Dream Shape Cake', ar: 'كيك الأحلام' },
    cta: { en: 'Shop Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80',
    bg: 'from-[#F0E6FA] to-[#E2D4F0]',
    link: 'custom',
  },
]

export const heroSlides = [
  {
    id: 1,
    tag: { en: 'New Arrival', ar: 'وصل حديثاً' },
    title: { en: 'Rose Gold Elegance', ar: 'أناقة الذهب الوردي' },
    description: {
      en: 'Layers of vanilla sponge with rose-infused buttercream and edible gold leaf.',
      ar: 'طبقات فانيليا مع كريمة الورد وورق الذهب.',
    },
    cta: { en: 'Order Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80',
    productId: 1,
  },
  {
    id: 2,
    tag: { en: 'Best Seller', ar: 'الأكثر مبيعاً' },
    title: { en: 'Ramadan Crescent', ar: 'هلال رمضان' },
    description: {
      en: 'Seasonal creation with dates, pistachio, and rose water.',
      ar: 'إبداع موسمي بالتمر والفستق وماء الورد.',
    },
    cta: { en: 'Order Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1587668178575-beb4e6c72572?w=1920&q=80',
    productId: 5,
  },
  {
    id: 3,
    tag: { en: 'Limited Edition', ar: 'إصدار محدود' },
    title: { en: 'Pearl Wedding Tower', ar: 'برج اللؤلؤ للأعراس' },
    description: {
      en: 'Five-tier masterpiece with pearl fondant and cascading sugar flowers.',
      ar: 'تحفة من خمس طبقات بتشطيب لؤلؤي وورود سكر.',
    },
    cta: { en: 'Order Now', ar: 'اطلب الآن' },
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1920&q=80',
    productId: 6,
  },
]

export const promoBanners = [
  {
    id: 'bestsellers',
    title: { en: 'Our Best Sellers', ar: 'الأكثر مبيعاً' },
    subtitle: { en: 'Delightful assortment of artisan cakes', ar: 'تشكيلة رائعة من الكيك الحرفي' },
    cta: { en: 'Shop Now', ar: 'تسوق الآن' },
    image: 'https://images.unsplash.com/photo-1606312615240-497af8f638e0?w=1920&q=80',
    link: 'shop',
  },
  {
    id: 'delight',
    title: { en: 'Savor Freshly Baked Cakes', ar: 'استمتع بالكيك الطازج' },
    subtitle: { en: 'Baked daily with premium ingredients', ar: 'يُخبز يومياً بمكونات فاخرة' },
    cta: { en: 'Shop Now', ar: 'تسوق الآن' },
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80',
    link: 'shop',
  },
]

export const welcomeOffer = {
  code: 'WELCOME10',
  title: { en: 'Welcome Gift!', ar: 'هدية ترحيب!' },
  description: {
    en: 'Enjoy 10% off your first order. Use code at checkout.',
    ar: 'استمتع بخصم 10% على طلبك الأول. استخدم الكود عند الدفع.',
  },
  cta: { en: 'Start Shopping', ar: 'ابدأ التسوق' },
}
