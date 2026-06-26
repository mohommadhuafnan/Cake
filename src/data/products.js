export const products = [
  {
    id: 1,
    name: { en: 'Rose Gold Elegance', ar: 'أناقة الذهب الوردي' },
    description: {
      en: 'Layers of vanilla sponge with rose-infused buttercream, adorned with edible gold leaf and fresh roses.',
      ar: 'طبقات من الكيك الفانيليا مع كريمة الزبدة بنكهة الورد، مزينة بورق الذهب والورود الطازجة.',
    },
    price: 450,
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=800&q=80',
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    ],
    stock: 10,
    rating: 4.9,
    reviews: 24,
    popular: 95,
  },
  {
    id: 2,
    name: { en: 'Midnight Chocolate', ar: 'شوكولاتة منتصف الليل' },
    description: {
      en: 'Rich dark chocolate ganache with Belgian cocoa, topped with gold-dusted truffles.',
      ar: 'غاناش شوكولاتة داكنة غنية مع الكاكاو البلجيكي، مغطاة بترuffles مرشوشة بالذهب.',
    },
    price: 320,
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1606317138400-f2899e2919ee?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1606317138400-f2899e2919ee?w=800&q=80'],
    stock: 15,
    rating: 4.8,
    reviews: 18,
    popular: 88,
  },
  {
    id: 3,
    name: { en: 'Blush Berry Dream', ar: 'حلم التوت الوردي' },
    description: {
      en: 'Light sponge with mixed berry compote and mascarpone cream, finished with macarons.',
      ar: 'كيك خفيف مع كومبوت التوت وكريمة الماسكاربون، منتهي بالماكaron.',
    },
    price: 280,
    category: 'birthday',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80'],
    stock: 12,
    rating: 4.7,
    reviews: 31,
    popular: 82,
  },
  {
    id: 4,
    name: { en: 'Corporate Signature', ar: 'التوقيع المؤسسي' },
    description: {
      en: 'Minimalist design perfect for corporate events. Custom logo printing available.',
      ar: 'تصميم بسيط مثالي للفعاليات المؤسسية. طباعة الشعار متاحة.',
    },
    price: 550,
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80'],
    stock: 8,
    rating: 4.9,
    reviews: 12,
    popular: 75,
  },
  {
    id: 5,
    name: { en: 'Ramadan Crescent', ar: 'هلال رمضان' },
    description: {
      en: 'Seasonal creation with dates, pistachio, and rose water — a celebration of tradition.',
      ar: 'إبداع موسمي بالتمر والفستق وماء الورد — احتفاء بالتقاليد.',
    },
    price: 380,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80'],
    stock: 20,
    rating: 5.0,
    reviews: 45,
    popular: 98,
  },
  {
    id: 6,
    name: { en: 'Pearl Wedding Tower', ar: 'برج اللؤلؤ للأعراس' },
    description: {
      en: 'Five-tier masterpiece with pearl fondant finish and cascading sugar flowers.',
      ar: 'تحفة من خمس طبقات بتشطيب فوندant لؤلؤي وورود سكر متتالية.',
    },
    price: 1200,
    category: 'wedding',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80'],
    stock: 3,
    rating: 5.0,
    reviews: 8,
    popular: 100,
  },
]

export const categories = [
  { id: 'wedding', name: { en: 'Wedding', ar: 'أعراس' }, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80' },
  { id: 'birthday', name: { en: 'Birthday', ar: 'أعياد ميلاد' }, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { id: 'corporate', name: { en: 'Corporate', ar: 'شركات' }, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { id: 'seasonal', name: { en: 'Seasonal', ar: 'موسمي' }, image: 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80' },
]

export const testimonials = [
  { id: 1, name: 'Fatima Al-Thani', text: { en: 'The wedding cake was absolutely stunning. Every guest asked where we ordered it from!', ar: 'كان كيك الزفاف مذهلاً. كل ضيف سأل من أين طلبناه!' }, rating: 5 },
  { id: 2, name: 'Sarah Mitchell', text: { en: 'Maison Douceur exceeded all expectations. The attention to detail is unmatched in Qatar.', ar: 'ميزون دوسير فاقت كل التوقعات. الاهتمام بالتفاصيل لا مثيل له في قطر.' }, rating: 5 },
  { id: 3, name: 'Ahmed Hassan', text: { en: 'Ordered a custom corporate cake for our event. Professional, elegant, and delicious.', ar: 'طلبنا كيك مؤسسي مخصص لفعاليتنا. احترافي وأنيق ولذيذ.' }, rating: 5 },
  { id: 4, name: 'Layla Al-Kuwari', text: { en: 'My daughter\'s birthday cake was a dream come true. She cried happy tears!', ar: 'كيك عيد ميلاد ابنتي كان حلماً تحقق. بكت من الفرح!' }, rating: 5 },
]

/** Gallery uses one unique image per product — always in sync with catalog */
export const galleryImages = products.map((p) => ({
  id: p.id,
  src: p.image,
  name: p.name,
  price: p.price,
}))
