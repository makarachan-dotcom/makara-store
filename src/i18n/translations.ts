// ប្រព័ន្ធភាសាពីរ - ខ្មែរ និង អង់គ្លេស

export type Locale = 'km' | 'en'

export const translations = {
  km: {
    // ទូទៅ
    siteName: 'Makara Store',
    home: 'ទំព័រដើម',
    products: 'ផលិតផល',
    categories: 'ប្រភេទ',
    favorites: 'ចំណូលចិត្ត',
    cart: 'កន្ត្រក',
    menu: 'មីនុយ',
    liveChat: 'ជជែកផ្ទាល់',
    search: 'ស្វែងរក...',
    login: 'ចូល',
    register: 'ចុះឈ្មោះ',
    logout: 'ចាកចេញ',
    profile: 'ប្រវត្តិរូប',
    settings: 'ការកំណត់',
    language: 'ភាសា',
    
    // ផលិតផល
    addToCart: 'បន្ថែមទៅកន្ត្រក',
    buyNow: 'ទិញឥឡូវ',
    inStock: 'មានក្នុងស្តុក',
    outOfStock: 'អស់ស្តុក',
    lowStock: 'សល់តិច',
    preOrder: 'កម្មង់មុន',
    price: 'តម្លៃ',
    featured: 'ពិសេស',
    newArrival: 'មកដល់ថ្មី',
    bestSeller: 'លក់ដាច់បំផុត',
    
    // ការទូទាត់
    checkout: 'បង់ប្រាក់',
    paymentMethod: 'វិធីបង់ប្រាក់',
    uploadReceipt: 'ផ្ទុកបង្កាន់ដៃ',
    orderTotal: 'សរុប',
    orderHistory: 'ប្រវត្តិការបញ្ជាទិញ',
    orderPending: 'កំពុងរង់ចាំ',
    orderProcessing: 'កំពុងដំណើរការ',
    orderCompleted: 'បានបញ្ចប់',
    orderCancelled: 'បានបោះបង់',
    
    // ChatGPT
    chatgptUpgrade: 'ដំឡើង ChatGPT',
    selectPlan: 'ជ្រើសរើសគម្រោង',
    accountDetails: 'ព័ត៌មានគណនី',
    submitOrder: 'បញ្ជូនការបញ្ជាទិញ',
    
    // Admin
    adminPanel: 'ផ្ទាំងគ្រប់គ្រង',
    dashboard: 'ផ្ទាំងព័ត៌មាន',
    manageProducts: 'គ្រប់គ្រងផលិតផល',
    manageOrders: 'គ្រប់គ្រងការបញ្ជាទិញ',
    manageReceipts: 'គ្រប់គ្រងបង្កាន់ដៃ',
    siteSettings: 'ការកំណត់គេហទំព័រ',
    announcements: 'ការជូនដំណឹង',
    updateWebsite: 'ធ្វើបច្ចុប្បន្នភាពគេហទំព័រ',
    maintenanceMode: 'របៀបថែទាំ',
    
    // ទំព័រផ្សេងៗ
    instructions: 'សេចក្ដីណែនាំ',
    privacyPolicy: 'គោលការណ៍ឯកជនភាព',
    apiKey: 'API Key',
    availableSoon: 'នឹងមកដល់ឆាប់ៗនេះ',
    contactAdmin: 'ទាក់ទង Admin',
    telegramAdmin: 'Telegram Admin',
    
    // ស្ថានភាព
    maintenanceTitle: 'ទំព័រកំពុងធ្វើបច្ចុប្បន្នភាព',
    maintenanceDesc: 'យើងកំពុងធ្វើបច្ចុប្បន្នភាពគេហទំព័រ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។',
    
    // Intro
    introText: 'Welcome to Makara Store',
    introBy: 'Premium Digital Store',
    
    // AI Chat
    aiChatTitle: 'ជំនួយការ AI',
    aiChatPlaceholder: 'សរសេរសារ...',
    liveAdminSupport: 'ជំនួយ Admin ផ្ទាល់',
    
    // វេរទូទាត់
    receiptBlurry: 'រូបភាពមិនច្បាស់។ សូមផ្ទុករូបភាពថ្មី។',
    receiptInvalid: 'រូបភាពមិនមែនជាបង្កាន់ដៃបង់ប្រាក់។',
    receiptUploaded: 'បង្កាន់ដៃត្រូវបានផ្ទុកដោយជោគជ័យ។',
    
    // ការផ្ទៀងផ្ទាត់
    emailRequired: 'សូមបំពេញអ៊ីមែល',
    passwordRequired: 'សូមបំពេញពាក្យសម្ងាត់',
    invalidCredentials: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
    accountCreated: 'គណនីត្រូវបានបង្កើតដោយជោគជ័យ',
    forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
    recoverAccount: 'សង្គ្រោះគណនី',
    sendRecoveryCode: 'ផ្ញើលេខកូដសង្គ្រោះ',
    verifyCode: 'ផ្ទៀងផ្ទាត់លេខកូដ',
    resetPassword: 'កំណត់ពាក្យសម្ងាត់ថ្មី',
    passwordChanged: 'ពាក្យសម្ងាត់បានផ្លាស់ប្តូរដោយជោគជ័យ!',
    aiDisclaimer: 'AI អាចមានកំហុស',
    
    // Appearance
    appearance: 'ការបង្ហាញ',
    darkMode: 'ងងឹត',
    lightMode: 'ភ្លឺ',
    accentColor: 'ពណ៌គូសបញ្ជាក់',
  },
  en: {
    siteName: 'Makara Store',
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    favorites: 'Favorites',
    cart: 'Cart',
    menu: 'Menu',
    liveChat: 'Live Chat',
    search: 'Search...',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    preOrder: 'Pre-Order',
    price: 'Price',
    featured: 'Featured',
    newArrival: 'New Arrival',
    bestSeller: 'Best Seller',
    
    checkout: 'Checkout',
    paymentMethod: 'Payment Method',
    uploadReceipt: 'Upload Receipt',
    orderTotal: 'Total',
    orderHistory: 'Order History',
    orderPending: 'Pending',
    orderProcessing: 'Processing',
    orderCompleted: 'Completed',
    orderCancelled: 'Cancelled',
    
    chatgptUpgrade: 'Upgrade ChatGPT',
    selectPlan: 'Select Plan',
    accountDetails: 'Account Details',
    submitOrder: 'Submit Order',
    
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    manageReceipts: 'Manage Receipts',
    siteSettings: 'Site Settings',
    announcements: 'Announcements',
    updateWebsite: 'Update Website',
    maintenanceMode: 'Maintenance Mode',
    
    instructions: 'Instructions',
    privacyPolicy: 'Privacy Policy',
    apiKey: 'API Key',
    availableSoon: 'Available Soon',
    contactAdmin: 'Contact Admin',
    telegramAdmin: 'Telegram Admin',
    
    maintenanceTitle: 'Website Updating',
    maintenanceDesc: 'We are currently updating our website. Please try again later.',
    
    introText: 'Welcome to Makara Store',
    introBy: 'Premium Digital Store',
    
    aiChatTitle: 'AI Assistant',
    aiChatPlaceholder: 'Type a message...',
    liveAdminSupport: 'Live Admin Support',
    
    receiptBlurry: 'Image is too blurry. Please upload a clearer image.',
    receiptInvalid: 'Image is not a payment receipt.',
    receiptUploaded: 'Receipt uploaded successfully.',
    
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    invalidCredentials: 'Invalid credentials',
    accountCreated: 'Account created',
    forgotPassword: 'Forgot password?',
    recoverAccount: 'Recover Account',
    sendRecoveryCode: 'Send Recovery Code',
    verifyCode: 'Verify Code',
    resetPassword: 'Reset Password',
    passwordChanged: 'Password changed successfully!',
    aiDisclaimer: 'AI can make mistakes',
    
    appearance: 'Appearance',
    darkMode: 'Dark',
    lightMode: 'Light',
    accentColor: 'Accent Color',
  },
} as const

export type TranslationKey = keyof typeof translations.km
