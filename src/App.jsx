import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BadgePlus,
  BarChart3,
  Camera,
  CarFront,
  ChevronRight,
  CircleCheck,
  Clipboard,
  CupSoda,
  CreditCard,
  ExternalLink,
  Flame,
  Heart,
  LayoutGrid,
  Leaf,
  List,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Mic,
  MicOff,
  Minus,
  Nfc,
  Pencil,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  Search,
  Settings,
  ShoppingCart,
  Table2,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import cocoBackground from './assets/images/cocobambu_fundo.png'
import promoShrimp from './assets/images/slide_0.png'
import promoScampi from './assets/images/slide_2.png'
import categoriaBebidas from './assets/cards/hd/img bebidas@3x.jpg'
import categoriaCarnes from './assets/cards/hd/img carne@3x.jpg'
import categoriaEntradas from './assets/cards/hd/img entradas@3x.jpg'
import categoriaFrangos from './assets/cards/hd/img frango@3x.jpg'
import categoriaFrutosDoMar from './assets/cards/hd/img frutos do mar@3x.jpg'
import categoriaSaladas from './assets/cards/hd/img saladas@3x.jpg'
import categoriaSobremesas from './assets/cards/hd/img sobremesas@3x.jpg'
import categoriaVeganos from './assets/cards/hd/img vegano@3x.jpg'
import pratoCaldinhoDePeixe from './assets/images/crops/prato-caldinho-de-peixe.png'
import pratoCamaraoCocoBrasil from './assets/images/crops/prato-camarao-coco-brasil.png'
import pratoIscaDePeixe from './assets/images/crops/prato-isca-de-peixe.png'
import slideVezzBanner from './assets/images/crops/slide-vezz-banner-transparent.png'
import cocoLogo from './assets/images/hd/logo-coco-bambu@4x.png'
import iconBebidas from './assets/icons/icon bebidas.png'
import iconCarnes from './assets/icons/icon carne.png'
import iconEntradas from './assets/icons/icon entrada.png'
import iconFrangos from './assets/icons/icon frango.png'
import iconFrutosDoMar from './assets/icons/icon frutos do mar.png'
import iconSaladas from './assets/icons/icon salada.png'
import iconSobremesas from './assets/icons/icon sobremesa.png'
import iconVeganos from './assets/icons/icon vegano.png'
import { loginAdmin, logoutAdmin, translateAdminAuthError, watchAdminSession } from './lib/adminAuth'
import { persistAnalyticsEvent, persistOrder } from './lib/firebaseEvents'

const categories = [
  { id: 'entradas', label: 'Entradas', shortLabel: 'Entradas', iconImage: iconEntradas, image: categoriaEntradas },
  { id: 'saladas', label: 'Saladas', shortLabel: 'Saladas', iconImage: iconSaladas, image: categoriaSaladas },
  { id: 'frutos-do-mar', label: 'Frutos do Mar', shortLabel: 'Frutos do Mar', iconImage: iconFrutosDoMar, image: categoriaFrutosDoMar },
  { id: 'carnes', label: 'Carnes', shortLabel: 'Carnes', iconImage: iconCarnes, image: categoriaCarnes },
  { id: 'frangos', label: 'Frangos', shortLabel: 'Frangos', iconImage: iconFrangos, image: categoriaFrangos },
  { id: 'veganos', label: 'Veganos', shortLabel: 'Veganos', iconImage: iconVeganos, image: categoriaVeganos },
  { id: 'sobremesas', label: 'Sobremesas', shortLabel: 'Sobremesas', iconImage: iconSobremesas, image: categoriaSobremesas },
  { id: 'bebidas', label: 'Bebidas', shortLabel: 'Bebidas', iconImage: iconBebidas, image: categoriaBebidas },
]

const fallbackImages = {
  entradas: categoriaEntradas,
  saladas: categoriaSaladas,
  'frutos-do-mar': categoriaFrutosDoMar,
  carnes: categoriaCarnes,
  frangos: categoriaFrangos,
  veganos: categoriaVeganos,
  sobremesas: categoriaSobremesas,
  bebidas: categoriaBebidas,
}

const tableOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const restaurantId = 'tokka-foods'
const restaurantName = 'COCO BAMBU'
const defaultRestaurantProfile = {
  name: 'COCO BAMBU',
  location: 'Derby, Recife - PE',
  logo: cocoLogo,
  cover: cocoBackground,
}
const defaultAdminEmail = 'admin@tokkafoods.com.br'
const analyticsStorageKey = 'food99like-events'
const sessionStorageKey = 'food99like-session'
const cardBaseUrl = 'https://menu.food99like.app/c/8Ks29'
const partnerLinks = {
  vezz: 'https://vezzapp.com.br/',
  instagram: 'https://www.instagram.com/',
  whatsapp: 'https://wa.me/5581999999999',
}

const promoSlides = [
  {
    id: 'coco-brasil-promo',
    image: promoShrimp,
    alt: 'Promoção Camarão Coco Bambu por R$ 99,90',
    fit: 'contain',
  },
  {
    id: 'vezz-accessibility',
    image: slideVezzBanner,
    alt: 'Vezz, mobilidade para você ir mais longe',
    action: 'vezz',
    fit: 'contain',
  },
  {
    id: 'camarao-scampi',
    image: promoScampi,
    alt: 'Lançamento Camarão Scampi Coco Bambu',
    fit: 'contain',
  },
]

const allergenOptions = [
  { id: 'Ovo', label: 'Ovo', icon: 'ovo' },
  { id: 'Glúten', label: 'Glúten', icon: 'gluten' },
  { id: 'Peixe', label: 'Peixe', icon: 'peixe' },
  { id: 'Lactose', label: 'Lactose', icon: 'lactose' },
  { id: 'Crustáceos', label: 'Crustáceos', icon: 'crustaceos' },
  { id: 'Castanhas', label: 'Castanhas', icon: 'castanhas' },
  { id: 'Soja', label: 'Soja', icon: 'soja' },
]

const baseProducts = [
  {
    id: 'camarao-coco-brasil',
    category: 'frutos-do-mar',
    name: 'Camarão Coco Brasil',
    price: 199,
    image: pratoCamaraoCocoBrasil,
    badge: 'Destaque',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Camarões empanados e recheados com catupiry, sobre um cremoso arroz de moqueca com camarões e coentro.',
    voiceDescription:
      'Imagine uma travessa larga chegando à mesa. Na borda, camarões empanados formam uma coroa dourada, com casquinha crocante e recheio cremoso de catupiry. No centro, há arroz de moqueca bem úmido, perfumado com coentro e camarões menores. A batata palha aparece por cima como uma camada fina e crocante, criando contraste entre o molho quente, o queijo macio e o empanado.',
    tags: ['Ovo', 'Glúten', 'Peixe', 'Crustáceos', 'Lactose'],
    options: [
      { id: '2p', label: '2 pessoas', detail: '276g de Camarão', price: 199, people: 2 },
      { id: '3p', label: '3 pessoas', detail: '409g de Camarão', price: 240, people: 3 },
      { id: '4p', label: '4 pessoas', detail: '758g de Camarão', price: 405, people: 4 },
    ],
  },
  {
    id: 'camarao-ao-forno',
    category: 'frutos-do-mar',
    name: 'Camarão ao Forno',
    price: 147,
    image: categoriaFrutosDoMar,
    badge: 'Forno',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Camarões inteiros levados ligeiramente ao forno, regados com suave molho provençal.',
    voiceDescription:
      'O prato destaca camarões inteiros, alinhados em uma travessa quente. A superfície vem brilhante pelo molho provençal, com aroma de alho, ervas e azeite. A textura tende a ser firme e suculenta, sem peso de fritura. É uma opção com sabor marinho limpo, final aromático e toque tostado do forno.',
    tags: ['Crustáceos', 'Alho', 'Ervas'],
    options: [{ id: '2p', label: '2 pessoas', detail: 'Porção ao forno', price: 147, people: 2 }],
  },
  {
    id: 'camarao-jurere',
    category: 'frutos-do-mar',
    name: 'Camarão Jurerê',
    price: 185,
    image: categoriaFrutosDoMar,
    badge: 'Especial',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Camarões puxados no azeite extra virgem, alho e cebola, flambados com vinho branco.',
    voiceDescription:
      'O Camarão Jurerê tem um perfil mais aromático. Primeiro vem o perfume do azeite quente com alho e cebola. Depois aparecem os camarões salteados, levemente adocicados, cobertos por um molho curto de vinho branco. A experiência é mais delicada, com brilho no molho, sabor marinho e final amanteigado.',
    tags: ['Crustáceos', 'Alho', 'Vinho branco'],
    options: [{ id: '2p', label: '2 pessoas', detail: 'Camarões salteados', price: 185, people: 2 }],
  },
  {
    id: 'lagosta-grelhada',
    category: 'frutos-do-mar',
    name: 'Lagosta Grelhada',
    price: 276,
    image: categoriaFrutosDoMar,
    badge: 'Premium',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Lagosta grelhada com alcaparras e salsinha. Acompanha arroz de alho-poró e batatas ao vapor.',
    voiceDescription:
      'A lagosta grelhada chega com carne firme e delicada, levemente adocicada. A grelha adiciona aroma tostado, enquanto as alcaparras trazem salinidade e a salsinha entrega frescor. O arroz de alho-poró cria uma base cremosa e perfumada, e as batatas ao vapor equilibram o prato com textura macia.',
    tags: ['Crustáceos', 'Alcaparras', 'Alho-poró'],
    options: [{ id: '2p', label: '2 pessoas', detail: 'Lagosta grelhada', price: 276, people: 2 }],
  },
  {
    id: 'lagosta-com-arroz-dos-mares',
    category: 'frutos-do-mar',
    name: 'Lagosta com Arroz dos Mares',
    price: 270,
    image: categoriaFrutosDoMar,
    badge: 'Destaque',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Lagostas grelhadas, salpicadas com alho frito na manteiga, servidas sobre arroz cremoso dos mares.',
    voiceDescription:
      'Neste prato, a lagosta aparece sobre um arroz cremoso e generoso. O alho frito na manteiga adiciona perfume tostado e uma crocância discreta. Cada garfada mistura o dulçor da lagosta, a cremosidade do arroz e o sabor intenso da manteiga aromatizada.',
    tags: ['Crustáceos', 'Manteiga', 'Alho'],
    options: [{ id: '2p', label: '2 pessoas', detail: 'Arroz cremoso dos mares', price: 270, people: 2 }],
  },
  {
    id: 'isca-de-peixe',
    category: 'entradas',
    name: 'Isca de Peixe',
    price: 120,
    image: pratoIscaDePeixe,
    badge: 'Entrada',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: BadgePlus,
    badgeIconTone: 'text-amber-600',
    description:
      'Iscas crocantes de peixe, servidas para compartilhar antes do prato principal.',
    voiceDescription:
      'As iscas de peixe são pedaços pequenos, empanados e dourados. A primeira sensação é a crocância da casquinha. Por dentro, o peixe fica macio, suave e úmido. É um prato fácil de dividir, bom para começar a refeição, especialmente com gotas de limão ou molho cremoso.',
    tags: ['Peixe', 'Glúten', 'Compartilhar'],
    options: [{ id: '2p', label: '2 pessoas', detail: 'Porção para entrada', price: 120, people: 2 }],
  },
  {
    id: 'caldinho-de-peixe',
    category: 'entradas',
    name: 'Caldinho de Peixe',
    price: 21,
    image: pratoCaldinhoDePeixe,
    badge: 'Quente',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: CupSoda,
    badgeIconTone: 'text-amber-600',
    description:
      'Caldinho cremoso e quente, servido como entrada leve e aromática.',
    voiceDescription:
      'O caldinho de peixe é servido quente, em textura cremosa. O aroma lembra caldo bem temperado, com sabor suave de peixe e final confortável. É uma entrada de colher, pensada para abrir o apetite sem pesar antes dos pratos principais.',
    tags: ['Peixe', 'Quente', 'Caldo'],
    options: [{ id: '1p', label: '1 pessoa', detail: 'Copo individual', price: 21, people: 1 }],
  },
  {
    id: 'salada-tropical',
    category: 'saladas',
    name: 'Salada Tropical',
    price: 64,
    image: categoriaSaladas,
    badge: 'Leve',
    badgeTone: 'border-emerald-100 bg-white text-emerald-700',
    badgeIcon: Leaf,
    badgeIconTone: 'fill-emerald-600 text-emerald-600',
    description:
      'Folhas frescas com legumes, tomate, toque cítrico e final crocante.',
    voiceDescription:
      'A salada tropical é fresca e colorida. As folhas trazem leveza, os legumes adicionam textura e o tomate deixa a mordida mais suculenta. O toque cítrico aparece no final, limpando o paladar e equilibrando pratos mais cremosos.',
    tags: ['Folhas', 'Tomate', 'Leve'],
  },
  {
    id: 'file-paulista',
    category: 'carnes',
    name: 'Filé à Paulista',
    price: 199,
    image: categoriaCarnes,
    badge: 'Destaque',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Filé mignon coberto com alhos fritos. Acompanha batatas recheadas e delicioso arroz.',
    voiceDescription:
      'O Filé à Paulista tem carne macia e suculenta, coberta por alhos fritos crocantes. As batatas recheadas trazem cremosidade, enquanto o arroz completa o prato com uma base confortável e bem servida.',
    tags: ['Carne', 'Alho', 'Batata'],
  },
  {
    id: 'frango-grelhado',
    category: 'frangos',
    name: 'Frango Grelhado',
    price: 89,
    image: categoriaFrangos,
    badge: 'Grelhado',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: Flame,
    badgeIconTone: 'fill-amber-500 text-amber-500',
    description:
      'Peito de frango grelhado, legumes e acompanhamento leve da casa.',
    voiceDescription:
      'O frango grelhado é uma opção mais direta e leve. A carne vem marcada pela grelha, com aroma tostado e interior macio. Os legumes dão cor, frescor e textura ao prato.',
    tags: ['Frango', 'Legumes', 'Leve'],
  },
  {
    id: 'massa-vegana',
    category: 'veganos',
    name: 'Massa Vegana',
    price: 78,
    image: categoriaVeganos,
    badge: 'Vegano',
    badgeTone: 'border-emerald-100 bg-white text-emerald-700',
    badgeIcon: Leaf,
    badgeIconTone: 'fill-emerald-600 text-emerald-600',
    description:
      'Massa com legumes salteados, ervas frescas e azeite aromático.',
    voiceDescription:
      'A massa vegana combina fios de massa com legumes salteados e ervas frescas. A textura é macia, com pontos crocantes dos vegetais, e o azeite traz brilho e aroma ao prato.',
    tags: ['Vegano', 'Legumes', 'Ervas'],
  },
  {
    id: 'pudim-da-casa',
    category: 'sobremesas',
    name: 'Pudim da Casa',
    price: 28,
    image: categoriaSobremesas,
    badge: 'Doce',
    badgeTone: 'border-amber-200 bg-white text-[#4b160e]',
    badgeIcon: BadgePlus,
    badgeIconTone: 'text-amber-600',
    description:
      'Pudim cremoso com calda brilhante e final delicado.',
    voiceDescription:
      'O pudim da casa é liso, cremoso e servido frio. A calda brilhante escorre por cima, trazendo doçura de caramelo e textura macia em cada colherada.',
    tags: ['Lactose', 'Ovo', 'Caramelo'],
  },
  {
    id: 'drink-tropical',
    category: 'bebidas',
    name: 'Drink Tropical',
    price: 32,
    image: categoriaBebidas,
    badge: 'Gelado',
    badgeTone: 'border-sky-200 bg-white text-sky-600',
    badgeIcon: CupSoda,
    badgeIconTone: 'text-sky-600',
    description:
      'Bebida gelada, cítrica e refrescante para acompanhar frutos do mar.',
    voiceDescription:
      'O drink tropical é frio, aromático e cítrico. Ele refresca o paladar e combina bem com pratos cremosos ou frutos do mar, trazendo leveza entre as garfadas.',
    tags: ['Gelado', 'Cítrico', 'Refrescante'],
  },
]

function App() {
  const initialTable = getTableFromUrl()
  const [analyticsSession] = useState(() => getAnalyticsSession(initialTable))
  const [screen, setScreen] = useState(() => getInitialScreen())
  const [menuMode, setMenuMode] = useState('padrao')
  const [activeCategory, setActiveCategory] = useState(() => getCategoryFromHash() || 'frutos-do-mar')
  const [menuCategorySelected, setMenuCategorySelected] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(() => getProductFromHash())
  const [productReturnScreen, setProductReturnScreen] = useState('menu')
  const [restaurantProfile, setRestaurantProfile] = useState(defaultRestaurantProfile)
  const [promoItems, setPromoItems] = useState(promoSlides)
  const [products, setProducts] = useState(baseProducts)
  const [cart, setCart] = useState([])
  const [tableNumber, setTableNumber] = useState(initialTable || '')
  const [nfcTable, setNfcTable] = useState(initialTable || '01')
  const [copied, setCopied] = useState(false)
  const [orderSent, setOrderSent] = useState(false)
  const [voiceReaderEnabled, setVoiceReaderEnabled] = useState(false)
  const [voiceCommandListening, setVoiceCommandListening] = useState(false)
  const [readerStatus, setReaderStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [adminSession, setAdminSession] = useState({
    loading: true,
    user: null,
    isAdmin: false,
    error: '',
  })
  const [adminLoginError, setAdminLoginError] = useState('')
  const [adminLoginLoading, setAdminLoginLoading] = useState(false)
  const speechStopTimerRef = useRef(null)
  const initialMenuEventSyncedRef = useRef(false)
  const [analyticsEvents, setAnalyticsEvents] = useState(() => {
    const nextEvents = [
      ...readAnalyticsEvents(),
      buildAnalyticsEvent('menu_open', analyticsSession, {
        tableNumber: initialTable || '',
        language: 'pt-BR',
      }),
    ].slice(-500)

    saveAnalyticsEvents(nextEvents)
    return nextEvents
  })

  const menuProducts = useMemo(
    () => products.filter((product) => product.active !== false),
    [products],
  )
  const selectedProduct =
    menuProducts.find((product) => product.id === selectedProductId) ?? menuProducts[0] ?? products[0]
  const cartItems = cart
    .map((item) => ({
      ...item,
      product: menuProducts.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product)
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.unitPrice ?? item.product.price) * item.quantity,
    0,
  )
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
  const generatedNfcLink = buildNfcUrl(nfcTable || tableNumber || '01')
  const analyticsSummary = useMemo(
    () => buildAnalyticsSummary(analyticsEvents, products, analyticsSession),
    [analyticsEvents, products, analyticsSession],
  )

  const trackEvent = useCallback(
    (eventName, payload = {}) => {
      const event = buildAnalyticsEvent(eventName, analyticsSession, payload)

      setAnalyticsEvents((events) => {
        const nextEvents = [...events, event].slice(-500)
        saveAnalyticsEvents(nextEvents)
        return nextEvents
      })

      persistAnalyticsEvent(event)
    },
    [analyticsSession],
  )

  const stopSpeech = useCallback((status = '') => {
    if (speechStopTimerRef.current) {
      window.clearTimeout(speechStopTimerRef.current)
      speechStopTimerRef.current = null
    }

    cancelSpeechQueue()
    speechStopTimerRef.current = window.setTimeout(() => {
      cancelSpeechQueue()
      speechStopTimerRef.current = null
    }, 80)

    if (status) {
      setReaderStatus(status)
    }
  }, [])

  useEffect(() => {
    return watchAdminSession(restaurantId, (session) => {
      setAdminSession(session)

      if (session.isAdmin) {
        setAdminLoginError('')
      } else if (session.error) {
        setAdminLoginError(session.error)
      }
    })
  }, [])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      document.querySelector('[data-screen-title="true"]')?.focus()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [screen, selectedProductId])

  useEffect(() => {
    return () => {
      if (speechStopTimerRef.current) {
        window.clearTimeout(speechStopTimerRef.current)
      }

      cancelSpeechQueue()
    }
  }, [])

  useEffect(() => {
    if (initialMenuEventSyncedRef.current) return

    initialMenuEventSyncedRef.current = true

    const initialMenuEvent = [...analyticsEvents]
      .reverse()
      .find((event) => event.event === 'menu_open' && event.sessionId === analyticsSession.id)

    if (initialMenuEvent) {
      persistAnalyticsEvent(initialMenuEvent)
    }
  }, [analyticsEvents, analyticsSession.id])

  function showScreen(nextScreen, hashValue = nextScreen) {
    const normalizedScreen = nextScreen === 'entrada' ? 'menu' : nextScreen
    const normalizedHash = nextScreen === 'entrada' ? 'menu' : hashValue

    stopSpeech()
    setScreen(normalizedScreen)
    window.location.hash = normalizedHash
  }

  async function handleAdminLogin({ email, password }) {
    setAdminLoginError('')
    setAdminLoginLoading(true)

    try {
      await loginAdmin(email, password)
      trackEvent('admin_login', { email })
      showScreen('admin-cardapio')
    } catch (error) {
      setAdminLoginError(translateAdminAuthError(error))
    } finally {
      setAdminLoginLoading(false)
    }
  }

  async function handleAdminLogout() {
    await logoutAdmin()
    setAdminLoginError('')
    trackEvent('admin_logout')
  }

  function startMenuMode(mode) {
    setMenuMode(mode)
    showScreen('menu')

    if (mode === 'voz') {
      setVoiceReaderEnabled(true)
      speakText('Cardápio por voz ativado. Abra um prato para ouvir uma descrição detalhada.')
    }
  }

  function openProduct(product) {
    setProductReturnScreen(screen === 'categoria-pratos' ? 'categoria-pratos' : 'menu')
    setSelectedProductId(product.id)
    showScreen('produto', `produto=${product.id}`)
    trackEvent('product_view', {
      productId: product.id,
      productName: product.name,
      category: product.category,
    })

    if (voiceReaderEnabled) {
      readProductIngredients(product)
    }
  }

  function addToCart(productId, quantity = 1, note = '', option = null) {
    const product = products.find((item) => item.id === productId)
    const optionId = option?.id ?? ''

    setCart((items) => {
      const existing = items.find(
        (item) => item.productId === productId && item.note === note && item.optionId === optionId,
      )

      if (existing) {
        return items.map((item) =>
          item.productId === productId && item.note === note && item.optionId === optionId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [
        ...items,
        {
          productId,
          quantity,
          note,
          optionId,
          optionLabel: option?.label ?? '',
          optionDetail: option?.detail ?? '',
          people: option?.people ?? null,
          unitPrice: option?.price ?? product?.price ?? 0,
        },
      ]
    })

    setReaderStatus(`${product?.name ?? 'Item'} adicionado ao pedido.`)
    trackEvent('product_add', {
      productId,
      productName: product?.name ?? '',
      quantity,
      hasNote: Boolean(note),
      optionId,
    })
  }

  function updateCartItem(productId, quantity, optionId = '', note = '') {
    setCart((items) =>
      items
        .map((item) =>
          item.productId === productId && item.optionId === optionId && item.note === note
            ? { ...item, quantity }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function addAdminItem(item) {
    setProducts((items) => [...items, { ...item, active: true }])
    setActiveCategory(item.category)
    setMenuCategorySelected(true)
    trackEvent('admin_item_created', {
      productId: item.id,
      productName: item.name,
      category: item.category,
    })
  }

  function updateProduct(updatedProduct) {
    setProducts((items) =>
      items.map((item) =>
        item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item,
      ),
    )
    trackEvent('admin_item_updated', {
      productId: updatedProduct.id,
      productName: updatedProduct.name,
      category: updatedProduct.category,
    })
  }

  function toggleProductActive(productId) {
    setProducts((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, active: item.active === false } : item,
      ),
    )
    trackEvent('admin_item_status_changed', { productId })
  }

  function removeProduct(productId) {
    const product = products.find((item) => item.id === productId)

    setProducts((items) => items.filter((item) => item.id !== productId))
    setCart((items) => items.filter((item) => item.productId !== productId))
    trackEvent('admin_item_removed', {
      productId,
      productName: product?.name ?? '',
      category: product?.category ?? '',
    })
  }

  async function copyNfcLink() {
    try {
      await navigator.clipboard?.writeText(generatedNfcLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  function openNfcPreview() {
    window.history.replaceState(null, '', `?mesa=${nfcTable || '01'}#menu`)
    setTableNumber(nfcTable || '01')
    trackEvent('card_preview', { tableNumber: nfcTable || '01' })
    showScreen('menu')
  }

  function changeCategory(categoryId) {
    setActiveCategory(categoryId)
    setMenuCategorySelected(true)
    setSearchQuery('')
    trackEvent('category_view', { category: categoryId })
  }

  function openCategoryProducts(categoryId) {
    setActiveCategory(categoryId)
    setMenuCategorySelected(true)
    setSearchQuery('')
    trackEvent('category_view', { category: categoryId, source: 'categories_screen' })
    showScreen('categoria-pratos', `categoria=${categoryId}`)
  }

  function changeSearchQuery(value, source = 'typing') {
    setSearchQuery(value)

    if (value.trim().length >= 3) {
      trackEvent(source === 'voice' ? 'voice_search' : 'search', {
        query: value.trim(),
      })
    }
  }

  function openPartnerLink(partner, url) {
    trackEvent(`${partner}_click`, { url })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openVezz() {
    speakText('Abrindo a Vezz Mobilidade.')
    openPartnerLink('vezz', partnerLinks.vezz)
  }

  function startVoiceCommand() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!Recognition) {
      speakText('Este navegador ainda não permite comandos de voz.')
      return
    }

    const recognition = new Recognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setVoiceCommandListening(true)
      setReaderStatus('Ouvindo comando de voz.')
    }

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? ''
      handleVoiceCommand(transcript)
    }

    recognition.onerror = () => {
      setReaderStatus('Não consegui ouvir o comando. Tente novamente.')
    }

    recognition.onend = () => {
      setVoiceCommandListening(false)
    }

    recognition.start()
  }

  function handleVoiceCommand(transcript) {
    const command = transcript.trim()
    const normalizedCommand = normalizeText(command)

    if (!command) return

    trackEvent('voice_command', { command })

    if (normalizedCommand.includes('voltar')) {
      showScreen('menu')
      speakText('Voltando para o cardápio.')
      return
    }

    if (normalizedCommand.includes('vezz') || normalizedCommand.includes('corrida')) {
      openVezz()
      return
    }

    const category = categories.find((item) =>
      normalizeText(`${item.label} ${item.shortLabel}`).includes(normalizedCommand) ||
      normalizedCommand.includes(normalizeText(item.shortLabel)),
    )

    if (category) {
      changeCategory(category.id)
      speakText(`Mostrando ${category.label}.`)
      return
    }

    const matchedProduct = findProductByCommand(menuProducts, normalizedCommand)

    if (normalizedCommand.includes('quanto custa') && matchedProduct) {
      speakText(`${matchedProduct.name} custa ${formatCurrency(matchedProduct.price)}.`)
      return
    }

    if (
      normalizedCommand.includes('abrir') &&
      matchedProduct
    ) {
      openProduct(matchedProduct)
      return
    }

    if (normalizedCommand.includes('vegetariana') || normalizedCommand.includes('vegetariano')) {
      changeSearchQuery('vegetariano', 'voice')
      speakText('Mostrando opções vegetarianas.')
      return
    }

    changeSearchQuery(command, 'voice')
    speakText(`Pesquisando por ${command}.`)
  }

  function toggleVoiceReader() {
    const nextValue = !voiceReaderEnabled

    setVoiceReaderEnabled(nextValue)

    if (nextValue) {
      speakText('Leitor automático ativado. Ao abrir um item, vou descrever a comida com mais detalhes.')
      return
    }

    stopSpeech('Leitor automático desativado.')
  }

  function readProductIngredients(product) {
    speakText(buildProductSpeech(product))
  }

  function speakText(message) {
    setReaderStatus(message)

    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance
    ) {
      setReaderStatus('Leitura por voz indisponível neste navegador.')
      return
    }

    if (speechStopTimerRef.current) {
      window.clearTimeout(speechStopTimerRef.current)
      speechStopTimerRef.current = null
    }

    cancelSpeechQueue()

    const utterance = new window.SpeechSynthesisUtterance(prepareSpeechText(message))
    utterance.lang = 'pt-BR'
    utterance.rate = 0.92
    utterance.pitch = 1
    utterance.onerror = () => setReaderStatus('Não foi possível iniciar a leitura por voz.')

    window.speechSynthesis.speak(utterance)
  }

  function sendOrder(orderData = {}) {
    const orderRecord = buildOrderRecord({
      analyticsSession,
      cartItems,
      cartTotal,
      orderData,
      tableNumber,
    })

    setOrderSent(true)
    setReaderStatus(`Pedido enviado para a mesa ${tableNumber || 'selecionada'}.`)
    persistOrder(orderRecord)
    trackEvent('order_sent', {
      orderId: orderRecord.id,
      tableNumber: tableNumber || '',
      serviceType: orderData.serviceType ?? 'mesa',
      paymentType: orderData.paymentType ?? 'caixa',
      hasCustomerName: Boolean(orderData.customerName?.trim()),
      cartQuantity,
      cartTotal,
    })
  }

  return (
    <main
      aria-label="Cardápio digital Coco Bambu"
      className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-950 md:grid md:place-items-center md:px-6 md:py-8"
    >
      <div
        className={`fixed inset-0 h-[100dvh] w-[100dvw] max-w-none overflow-hidden md:static md:mx-auto md:h-[932px] md:w-full md:max-w-[430px] md:rounded-[28px] md:shadow-2xl md:shadow-slate-300/80 ${
          screen === 'entrada' ? 'bg-[#45150d]' : 'bg-white'
        }`}
      >
        {screen === 'entrada' && (
          <EntryScreen onStart={startMenuMode} />
        )}

        {screen === 'menu' && (
          <MenuScreen
            products={menuProducts}
            activeCategory={activeCategory}
            menuCategorySelected={menuCategorySelected}
            cartQuantity={cartQuantity}
            cartTotal={cartTotal}
            menuMode={menuMode}
            promoItems={promoItems}
            restaurantProfile={restaurantProfile}
            searchQuery={searchQuery}
            tableNumber={tableNumber}
            onBack={() => showScreen('entrada')}
            onCategoryChange={(categoryId) => openCategoryProducts(categoryId)}
            onSearchChange={changeSearchQuery}
            onOpenCategories={() => showScreen('categorias')}
            onOpenSettings={() => showScreen('admin-cardapio')}
            onOpenProduct={openProduct}
            onAddToCart={addToCart}
            onOpenOrder={() => showScreen('pedido')}
            onOpenVezz={openVezz}
            onStartVoiceCommand={startVoiceCommand}
            onToggleVoiceReader={toggleVoiceReader}
            voiceCommandListening={voiceCommandListening}
            voiceReaderEnabled={voiceReaderEnabled}
          />
        )}

        {screen === 'categorias' && (
          <CategoriesScreen
            categories={categories}
            restaurantProfile={restaurantProfile}
            onBack={() => showScreen('menu')}
            onOpenSettings={() => showScreen('admin-cardapio')}
            onSelectCategory={openCategoryProducts}
          />
        )}

        {screen === 'categoria-pratos' && (
          <CategoryProductsScreen
            category={categories.find((category) => category.id === activeCategory) ?? categories[0]}
            products={menuProducts.filter((product) => product.category === activeCategory)}
            restaurantProfile={restaurantProfile}
            onBack={() => showScreen('categorias')}
            onOpenProduct={openProduct}
            onOpenSettings={() => showScreen('admin-cardapio')}
          />
        )}

        {screen === 'produto' && (
          <ProductScreen
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => {
              if (productReturnScreen === 'categoria-pratos') {
                showScreen('categoria-pratos', `categoria=${activeCategory}`)
                return
              }

              showScreen('menu')
            }}
            onAddToCart={addToCart}
            onOrderNow={() => showScreen('pedido')}
            onReadProduct={readProductIngredients}
          />
        )}

        {screen === 'configuracoes' && !adminSession.isAdmin && (
          <AdminLoginScreen
            defaultEmail={defaultAdminEmail}
            error={adminLoginError}
            loading={adminLoginLoading || adminSession.loading}
            onBack={() => showScreen('menu')}
            onLogin={handleAdminLogin}
          />
        )}

        {screen === 'configuracoes' && adminSession.isAdmin && (
          <SettingsScreen
            adminEmail={adminSession.user?.email ?? ''}
            copied={copied}
            nfcTable={nfcTable}
            categories={categories}
            products={products}
            analyticsSummary={analyticsSummary}
            generatedNfcLink={generatedNfcLink}
            onBack={() => showScreen('menu')}
            onAddAdminItem={addAdminItem}
            onCopyNfcLink={copyNfcLink}
            onNfcTableChange={setNfcTable}
            onOpenNfcPreview={openNfcPreview}
            onOpenPartnerLink={openPartnerLink}
            onLogout={handleAdminLogout}
            onOpenMenuEditor={() => showScreen('admin-cardapio')}
          />
        )}

        {screen === 'admin-cardapio' && !adminSession.isAdmin && (
          <AdminLoginScreen
            defaultEmail={defaultAdminEmail}
            error={adminLoginError}
            loading={adminLoginLoading || adminSession.loading}
            onBack={() => showScreen('menu')}
            onLogin={handleAdminLogin}
          />
        )}

        {screen === 'admin-cardapio' && adminSession.isAdmin && (
          <AdminMenuEditor
            categories={categories}
            products={products}
            promoItems={promoItems}
            restaurantProfile={restaurantProfile}
            onAddAdminItem={addAdminItem}
            onBack={() => showScreen('menu')}
            onDone={(nextProfile) => {
              if (nextProfile) {
                setRestaurantProfile(nextProfile)
              }
              showScreen('menu')
            }}
            onRemoveProduct={removeProduct}
            onToggleProductActive={toggleProductActive}
            onUpdatePromos={setPromoItems}
            onUpdateProduct={updateProduct}
          />
        )}

        {screen === 'pedido' && (
          <OrderScreen
            cartItems={cartItems}
            cartTotal={cartTotal}
            orderSent={orderSent}
            tableNumber={tableNumber}
            onBack={() => showScreen('menu')}
            onSendOrder={sendOrder}
            onTableChange={setTableNumber}
            onUpdateCartItem={updateCartItem}
          />
        )}

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {readerStatus}
        </p>
      </div>
    </main>
  )
}

function EntryScreen({ onStart }) {
  return (
    <section className="relative h-full overflow-hidden bg-[#46160f] px-14 text-[#d7ac5f]">
      <div className="absolute -right-20 top-0 size-60 rounded-full border border-[#8e6035]/20" />
      <div className="absolute -bottom-20 -left-24 size-72 rounded-full border border-[#8e6035]/20" />
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <img
          src={cocoLogo}
          alt="Coco Bambu"
          loading="eager"
          decoding="sync"
          className="w-[250px]"
          draggable="false"
        />
        <div className="grid w-full gap-9">
          {[
            ['padrao', 'CARDÁPIO PADRÃO'],
            ['voz', 'CARDÁPIO POR VOZ'],
            ['simplificado', 'CARDÁPIO SIMPLIFICADO'],
          ].map(([mode, label]) => (
            <button
              type="button"
              key={mode}
              onClick={() => onStart(mode)}
              className="h-[72px] rounded-[30px] bg-[#d8ad61] text-base font-medium text-black shadow-[0_6px_0_rgba(93,47,18,0.65)] transition active:translate-y-1 active:shadow-none"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-base font-medium">@cocobambuoficial</p>
      </div>
    </section>
  )
}

function CategoriesScreen({ categories, restaurantProfile = defaultRestaurantProfile, onBack, onOpenSettings, onSelectCategory }) {
  return (
    <section className="h-full overflow-y-auto bg-white pb-8 text-[#43160f]">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onOpenSettings} compact />
      <div className="relative z-10 -mt-9 rounded-t-[36px] bg-white px-5 pt-6 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <img
          src={restaurantProfile.logo}
          alt={restaurantProfile.name}
          loading="eager"
          decoding="sync"
          className="relative z-20 mx-auto -mt-20 size-[112px] rounded-full border-4 border-[#d8ad61] bg-[#4a160f]"
        />
        <h1 data-screen-title="true" tabIndex={-1} className="mt-2 text-center text-xl font-medium outline-none">
          CATEGORIAS
        </h1>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="min-h-[206px] text-center transition-transform duration-300 ease-out active:-translate-y-1"
            >
              <span className="relative block pb-8">
                <span className="block aspect-[154/107] overflow-hidden rounded-lg border-[3px] border-[#4b160e] bg-white">
                  <img
                    src={category.image}
                    alt=""
                    loading="eager"
                    decoding="sync"
                    className="block size-full object-cover"
                  />
                </span>
                <span className="absolute bottom-0 left-1/2 grid size-16 -translate-x-1/2 place-items-center rounded-full border-2 border-[#d8ad61] bg-[#4b160e] shadow-[0_3px_0_rgba(75,22,14,0.3)]">
                  <img src={category.iconImage} alt="" className="w-9" />
                </span>
              </span>
              <span className="mt-1 flex h-10 items-start justify-center text-center text-base font-black leading-[1.1]">
                {category.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryProductsScreen({ category, products, restaurantProfile = defaultRestaurantProfile, onBack, onOpenProduct, onOpenSettings }) {
  const groupedProducts = groupProductsByMenuSection(products, category)

  return (
    <section className="h-full overflow-y-auto bg-white pb-8 text-[#43160f]" aria-labelledby="category-products-title">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onOpenSettings} compact />

      <div className="relative z-10 -mt-7 rounded-t-[26px] bg-white px-4 pb-8 pt-[70px] shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="absolute left-1/2 top-[-70px] grid size-[126px] -translate-x-1/2 place-items-center rounded-full border-4 border-[#d8ad61] bg-[#4b160e] shadow-[0_9px_0_rgba(75,22,14,0.18),0_18px_34px_rgba(67,22,15,0.20)] ring-[5px] ring-white">
          <span className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_34%_24%,rgba(216,173,97,0.28),transparent_42%)]" />
          <span className="absolute inset-[13px] rounded-full border border-[#d8ad61]/35" />
          <img
            src={category.iconImage}
            alt=""
            className="relative z-10 w-[78px] drop-shadow-[0_3px_0_rgba(0,0,0,0.24)]"
          />
        </div>

        <h1
          id="category-products-title"
          data-screen-title="true"
          tabIndex={-1}
          className="text-center text-[22px] font-black outline-none"
        >
          {category.label.toUpperCase()}
        </h1>

        <div className="mt-5 space-y-5">
          {groupedProducts.length ? (
            groupedProducts.map((group) => (
              <section key={group.title}>
                <h2 className="mb-2 px-1 text-[17px] font-black">{group.title}</h2>
                <div className="space-y-2.5">
                  {group.products.map((product) => (
                    <CategoryDishCard
                      key={product.id}
                      product={product}
                      onOpen={() => onOpenProduct(product)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="rounded-lg bg-[#f0f0f0] p-4 text-sm font-bold text-[#7d6259]">
              Nenhum prato cadastrado nesta categoria.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function CategoryDishCard({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={buildProductAriaLabel(product)}
      className="grid h-[116px] w-full grid-cols-[1fr_130px] gap-3 overflow-hidden rounded-lg bg-[#f0f0f0] p-3 text-left"
    >
      <span className="flex min-w-0 flex-col overflow-hidden">
        <span className="line-clamp-2 block text-[13px] font-black leading-tight">{product.name.toUpperCase()}</span>
        <span className="mt-1.5 line-clamp-2 block text-[13px] font-medium leading-[18px]">
          {product.description}
        </span>
        <span className="mt-auto block text-sm font-black">{formatCurrency(product.price)}</span>
      </span>
      <span className="relative block h-[90px] self-center overflow-hidden rounded-lg bg-[#4b160e]">
        <img src={product.image} alt="" className="block size-full object-cover" />
        <span className="absolute bottom-2 right-2 flex h-5 items-center justify-center whitespace-nowrap rounded-full bg-white/95 px-2 text-[7.5px] font-black leading-none text-[#4b160e] shadow-[0_2px_8px_rgba(67,22,15,0.16)]">
          VER PRATO &gt;
        </span>
      </span>
    </button>
  )
}

function TopPhotoBar({
  backgroundImage = cocoBackground,
  onBack,
  onOpenSettings,
  trailingIcon = 'settings',
  compact = false,
  showBack = true,
}) {
  return (
    <div className={`relative overflow-hidden ${compact ? 'h-[144px]' : 'h-[124px]'}`}>
      <img src={backgroundImage} alt="" className="h-full w-full object-cover" draggable="false" />
      <div className="absolute inset-0 bg-black/10" />
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className={`absolute left-7 grid size-11 place-items-center rounded-full bg-white/85 text-[#4b160e] shadow-lg shadow-black/15 ring-1 ring-white/70 transition active:scale-95 ${
            compact ? 'top-6' : 'top-8'
          }`}
        >
          <ArrowLeft size={25} strokeWidth={2.8} />
        </button>
      )}
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label={trailingIcon === 'heart' ? 'Favoritar' : 'Configurações'}
        className={`absolute right-7 grid size-11 place-items-center rounded-full bg-white/85 text-[#4b160e] shadow-lg shadow-black/15 ring-1 ring-white/70 transition active:scale-95 ${
          compact ? 'top-6' : 'top-8'
        }`}
      >
        {trailingIcon === 'heart' ? <Heart size={25} strokeWidth={2.6} /> : <Settings size={25} strokeWidth={2.6} />}
      </button>
    </div>
  )
}

function MenuScreen({
  products,
  activeCategory,
  menuCategorySelected,
  cartQuantity,
  cartTotal,
  menuMode,
  promoItems = promoSlides,
  restaurantProfile = defaultRestaurantProfile,
  searchQuery,
  onBack,
  onCategoryChange,
  onSearchChange,
  onOpenCategories,
  onOpenSettings,
  onOpenProduct,
  onOpenOrder,
  onOpenVezz,
  onStartVoiceCommand,
  voiceCommandListening,
}) {
  const [promoIndex, setPromoIndex] = useState(0)
  const [productLayout, setProductLayout] = useState('lista')
  const [menuSheetRaised, setMenuSheetRaised] = useState(false)
  const visibleProducts = filterProducts(products, searchQuery)
  const selectedCategory = categories.find((category) => category.id === activeCategory) ?? categories[0]
  const categoryProducts = visibleProducts.filter((product) => product.category === activeCategory)
  const featuredProducts = visibleProducts.slice(0, menuMode === 'simplificado' ? 4 : 5)
  const selectedDailySource = menuCategorySelected && categoryProducts.length ? categoryProducts : visibleProducts
  const dailyProducts = selectedDailySource
    .filter((product) => !featuredProducts.some((featuredProduct) => featuredProduct.id === product.id))
    .slice(0, menuMode === 'simplificado' ? 2 : 4)
  const menuSectionTitle = searchQuery.trim() ? 'RESULTADOS' : 'DESTAQUES'
  const previewCategories = categories.slice(0, 3)
  const safePromoIndex = promoItems.length ? Math.min(promoIndex, promoItems.length - 1) : 0

  useEffect(() => {
    if (!promoItems.length) return undefined

    const intervalId = window.setInterval(() => {
      setPromoIndex((currentIndex) => (currentIndex + 1) % promoItems.length)
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [promoItems.length])

  function handleMenuScroll(event) {
    const nextValue = event.currentTarget.scrollTop > 24
    setMenuSheetRaised((currentValue) => (currentValue === nextValue ? currentValue : nextValue))
  }

  return (
    <section
      className="relative h-full overflow-y-auto bg-white pb-28 text-[#43160f]"
      aria-labelledby="menu-title"
      onScroll={handleMenuScroll}
    >
      <div className="sticky top-0 z-0">
        <TopPhotoBar
          backgroundImage={restaurantProfile.cover}
          onBack={onBack}
          onOpenSettings={onOpenSettings}
          showBack={false}
        />
      </div>

      <img
        src={restaurantProfile.logo}
        alt={restaurantProfile.name}
        loading="eager"
        decoding="sync"
        className={`pointer-events-none absolute left-1/2 top-[43px] size-[82px] -translate-x-1/2 rounded-full border-[3px] border-[#d8ad61] bg-[#4a160f] transition-all duration-500 ease-out ${
          menuSheetRaised ? 'z-0 -translate-y-5 opacity-0 scale-95' : 'z-30 translate-y-0 opacity-100 scale-100'
        }`}
        draggable="false"
      />

      <div className="relative z-20 -mt-8 rounded-t-[34px] bg-white px-8 pb-4 pt-9 shadow-[0_-18px_42px_rgba(67,22,15,0.12)]">
        <div className="text-center">
          <h1 id="menu-title" data-screen-title="true" tabIndex={-1} className="text-[22px] font-black outline-none">
            {restaurantProfile.name}
          </h1>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-[#4b231b]">
            <MapPin size={12} fill="#111" />
            {restaurantProfile.location}
          </p>
        </div>

        <div className="-mx-8 mt-3">
          <PromoCarousel
            activeIndex={safePromoIndex}
            slides={promoItems}
            onSelect={setPromoIndex}
            onOpenVezz={onOpenVezz}
          />
        </div>

        <div className="mt-1 flex justify-center gap-1.5" aria-label="Selecionar banner">
          {promoItems.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => setPromoIndex(index)}
              aria-label={`Mostrar banner ${index + 1}`}
              aria-current={safePromoIndex === index}
              className={`size-2 rounded-full transition ${
                safePromoIndex === index ? 'bg-[#4b160e]' : 'bg-[#d0d0d0]'
              }`}
            />
          ))}
        </div>

        <div className="mt-2.5 grid h-10 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full bg-[#eeeeee] px-4">
          <Search size={20} className="text-[#bdb8b5]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar pratos..."
            className="h-full bg-transparent text-sm font-medium text-[#43160f] outline-none placeholder:text-[#bdb8b5]"
          />
          <button
            type="button"
            onClick={onStartVoiceCommand}
            aria-label="Buscar por voz"
            aria-pressed={voiceCommandListening}
            className={voiceCommandListening ? 'text-[#4b160e]' : 'text-[#bdb8b5]'}
          >
            {voiceCommandListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <h2 className="text-[15px] font-medium">CATEGORIAS</h2>
          <button type="button" onClick={onOpenCategories} className="text-xs text-[#a98272]">
            Ver todos &gt;
          </button>
        </div>

        <div className="-mx-8 -mt-2 overflow-hidden pt-3">
          <div className="relative left-1/2 flex w-max -translate-x-1/2 gap-2">
            {previewCategories.map((category) => (
              <CategoryPreviewCard
                key={category.id}
                category={category}
                active={menuCategorySelected && category.id === activeCategory}
                onClick={() => onCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <h2 className="text-[15px] font-medium">{menuSectionTitle}</h2>
          <ViewModeToggle value={productLayout} onChange={setProductLayout} />
        </div>

        <div className={productLayout === 'grade' ? '-mx-4 mt-2 grid grid-cols-2 gap-2.5' : '-mx-4 mt-2 space-y-2.5'}>
          {featuredProducts.map((product) => (
            productLayout === 'grade' ? (
              <MenuProductGridCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
            ) : (
              <MenuProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
            )
          ))}
        </div>

        {!searchQuery.trim() && dailyProducts.length > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-[15px] font-medium">PRATOS DO DIA</h2>
              <span className="text-[11px] font-semibold text-[#a98272]">
                {menuCategorySelected ? selectedCategory.label : 'Seleção da casa'}
              </span>
            </div>

            <div className={productLayout === 'grade' ? '-mx-4 mt-2 grid grid-cols-2 gap-2.5' : '-mx-4 mt-2 space-y-2.5'}>
              {dailyProducts.map((product) => (
                productLayout === 'grade' ? (
                  <MenuProductGridCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
                ) : (
                  <MenuProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
                )
              ))}
            </div>
          </>
        )}
      </div>

      {cartQuantity > 0 && (
        <CartBar quantity={cartQuantity} total={cartTotal} onOpenOrder={onOpenOrder} />
      )}
    </section>
  )
}

function PromoCarousel({ activeIndex, slides = promoSlides, onSelect, onOpenVezz }) {
  const carouselRef = useRef(null)
  const touchStartRef = useRef(null)
  const swipeMovedRef = useRef(false)
  const [slideWidth, setSlideWidth] = useState(316)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined

    function updateSlideWidth(width) {
      setSlideWidth(Math.min(316, Math.max(286, Math.round(width * 0.735))))
    }

    updateSlideWidth(carousel.getBoundingClientRect().width)

    const observer = new ResizeObserver(([entry]) => {
      updateSlideWidth(entry.contentRect.width)
    })

    observer.observe(carousel)

    return () => observer.disconnect()
  }, [])

  function selectRelativeSlide(direction) {
    onSelect((activeIndex + direction + slides.length) % slides.length)
  }

  function getSlideOffset(index) {
    let offset = index - activeIndex

    if (offset > slides.length / 2) offset -= slides.length
    if (offset < -slides.length / 2) offset += slides.length

    return offset
  }

  function handleSlideClick(slide, index) {
    if (swipeMovedRef.current) {
      return
    }

    if (index !== activeIndex) {
      onSelect(index)
      return
    }

    if (slide.action === 'vezz') {
      onOpenVezz()
    }
  }

  function handleTouchStart(event) {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    swipeMovedRef.current = false
    setIsDragging(true)
    setDragOffset(0)
  }

  function handleTouchMove(event) {
    const touch = event.touches[0]
    const start = touchStartRef.current

    if (!start) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeMovedRef.current = true
      setDragOffset(Math.max(slideWidth * -0.92, Math.min(slideWidth * 0.92, deltaX)))
    }
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current

    if (!start) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const isHorizontalSwipe = Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15

    touchStartRef.current = null
    setIsDragging(false)
    setDragOffset(0)

    if (isHorizontalSwipe) {
      swipeMovedRef.current = true
      selectRelativeSlide(deltaX < 0 ? 1 : -1)
      window.setTimeout(() => {
        swipeMovedRef.current = false
      }, 250)
      return
    }

    if (swipeMovedRef.current) {
      window.setTimeout(() => {
        swipeMovedRef.current = false
      }, 250)
    }
  }

  function handleTouchCancel() {
    touchStartRef.current = null
    setIsDragging(false)
    setDragOffset(0)
    window.setTimeout(() => {
      swipeMovedRef.current = false
    }, 120)
  }

  if (!slides.length) return null

  return (
    <div
      ref={carouselRef}
      className="relative h-[96px] w-full touch-pan-y overflow-hidden py-[5px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {slides.map((slide, index) => {
        const offset = getSlideOffset(index)
        const slidePosition = offset + dragOffset / slideWidth
        const distanceFromCenter = Math.abs(slidePosition)
        const isActive = offset === 0
        const slideScale = 1 - Math.min(distanceFromCenter, 1) * 0.08

        return (
          <button
            type="button"
            key={slide.id}
            onClick={() => handleSlideClick(slide, index)}
            aria-label={slide.action === 'vezz' ? 'Abrir Vezz' : slide.alt}
            aria-current={isActive}
            className={`absolute left-1/2 top-[5px] grid h-[86px] place-items-center overflow-hidden rounded-lg shadow-[0_10px_24px_rgba(67,22,15,0.10)] ${
              isDragging ? 'transition-none' : 'transition-all duration-700 ease-out'
            } ${
              slide.id === 'vezz-accessibility' ? 'bg-[#15c8d0]' : 'bg-[#4b160e]'
            }`}
            style={{
              width: `${slideWidth}px`,
              transform: `translateX(calc(-50% + ${offset * slideWidth + dragOffset}px)) scale(${slideScale})`,
              opacity: distanceFromCenter > 1.35 ? 0 : 1,
              zIndex: Math.round((2 - Math.min(distanceFromCenter, 2)) * 10),
            }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={`h-full w-full ${slide.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
              draggable="false"
            />
          </button>
        )
      })}
    </div>
  )
}

function CategoryPreviewCard({ category, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="min-h-[104px] w-[calc((min(100vw,430px)-48px)/3)] flex-none text-center"
    >
      <span
        className={`relative block pb-7 transition-transform duration-300 ease-out ${
          active ? '-translate-y-2' : 'translate-y-0'
        }`}
      >
        <span
          className={`block aspect-[152/90] overflow-hidden rounded-md bg-white transition-shadow duration-300 ${
            active ? 'shadow-lg shadow-[#4b160e]/15 ring-2 ring-[#4b160e]' : ''
          }`}
        >
          <img
            src={category.image}
            alt=""
            loading="eager"
            decoding="sync"
            className="block size-full object-cover"
          />
        </span>
        <span
          className={`absolute bottom-1 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border-2 border-[#d8ad61] bg-[#4b160e] shadow-[0_3px_0_rgba(75,22,14,0.25)] transition-transform duration-300 ease-out ${
            active ? 'scale-105' : 'scale-100'
          }`}
        >
          <img
            src={category.iconImage}
            alt=""
            className="w-8 rounded-full drop-shadow-[0_1px_0_rgba(0,0,0,0.24)]"
          />
        </span>
      </span>
      <span className="mt-0.5 flex h-7 items-start justify-center text-center text-[12px] font-black leading-[1.05]">
        {category.label.toUpperCase()}
      </span>
    </button>
  )
}

function ViewModeToggle({ value, onChange }) {
  const options = [
    { id: 'lista', label: 'Visualizar em lista', icon: List },
    { id: 'grade', label: 'Visualizar em grade', icon: LayoutGrid },
  ]

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#f2eee9] p-1 ring-1 ring-[#e5d8cf]" aria-label="Modo de visualização">
      {options.map(({ id, label, icon: Icon }) => {
        const active = value === id

        return (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`grid size-8 place-items-center rounded-md transition ${
              active ? 'bg-[#4b160e] text-[#d8ad61] shadow-sm' : 'bg-white text-[#9d857c]'
            }`}
          >
            <Icon size={17} strokeWidth={2.7} />
          </button>
        )
      })}
    </div>
  )
}

function MenuProductCard({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={buildProductAriaLabel(product)}
      className="grid h-[116px] w-full grid-cols-[1fr_130px] gap-3 overflow-hidden rounded-lg bg-[#f0f0f0] p-3 text-left"
    >
      <span className="flex min-w-0 flex-col overflow-hidden">
        <span className="line-clamp-2 block text-sm font-black leading-tight">{product.name.toUpperCase()}</span>
        <span className="mt-1.5 line-clamp-2 block text-[13px] font-medium leading-[18px]">
          {product.description}
        </span>
        <span className="mt-auto block text-sm font-black">{formatCurrency(product.price)}</span>
      </span>
      <span className="relative block h-[96px] self-center overflow-hidden rounded-lg bg-[#4b160e]">
        <img src={product.image} alt="" className="block size-full object-cover" />
        <span className="absolute bottom-2 right-2 flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-white/95 px-2.5 text-[8.5px] font-black leading-none text-[#4b160e] shadow-[0_2px_8px_rgba(67,22,15,0.16)]">
          VER PRATO &gt;
        </span>
      </span>
    </button>
  )
}

function MenuProductGridCard({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={buildProductAriaLabel(product)}
      className="h-[204px] overflow-hidden rounded-lg bg-[#f0f0f0] p-2.5 text-left transition active:scale-[0.99]"
    >
      <span className="relative block h-[108px] overflow-hidden rounded-lg bg-[#4b160e]">
        <img src={product.image} alt="" className="block size-full object-cover" />
        <span className="absolute bottom-2 right-2 flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-white/95 px-2.5 text-[8.5px] font-black leading-none text-[#4b160e] shadow-[0_2px_8px_rgba(67,22,15,0.16)]">
          VER PRATO &gt;
        </span>
      </span>
      <span className="mt-3 line-clamp-2 block min-h-[32px] text-[13px] font-black leading-tight">{product.name.toUpperCase()}</span>
      <span className="mt-1 line-clamp-1 block h-4 text-[11px] font-medium leading-4 text-[#5e332a]">
        {product.description}
      </span>
      <span className="mt-1.5 block text-sm font-black">{formatCurrency(product.price)}</span>
    </button>
  )
}

function ProductScreen({ product, onBack, onAddToCart, onOrderNow, onReadProduct }) {
  const productOptions = useMemo(
    () =>
      product.options?.length
        ? product.options
        : [{ id: 'base', label: '1 pessoa', detail: 'Porção individual', price: product.price, people: 1 }],
    [product],
  )
  const [selectedOptionId, setSelectedOptionId] = useState(() => productOptions.at(-1)?.id ?? 'base')
  const selectedOption =
    productOptions.find((option) => option.id === selectedOptionId) ?? productOptions.at(-1)

  function addCurrentItem(openOrder = false) {
    onAddToCart(product.id, 1, '', selectedOption)

    if (openOrder) {
      onOrderNow()
    }
  }

  return (
    <section className="h-full overflow-y-auto overflow-x-hidden bg-white pb-8 text-[#4b160e]" aria-labelledby="product-title">
      <TopPhotoBar onBack={onBack} onOpenSettings={() => {}} trailingIcon="heart" compact />

      <div className="-mt-9 rounded-t-[36px] bg-white px-7 pb-8 pt-10 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="relative overflow-hidden rounded-lg bg-[#4b160e] p-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-[226px] w-full rounded-md object-cover"
            draggable="false"
          />
          <button
            type="button"
            onClick={() => onReadProduct(product)}
            aria-label={`Ouvir descrição acessível de ${product.name}`}
            title="Ouvir descrição"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-[#4b160e] shadow-lg"
          >
            <Volume2 size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5" aria-label="Alergênicos e características">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex min-h-6 items-center gap-1 rounded-full bg-[#eef1f3] px-2.5 text-[11px] font-medium text-[#9a8e89]"
            >
              <BadgePlus size={12} className="text-[#d5a55c]" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 text-center">
          <h1
            id="product-title"
            data-screen-title="true"
            tabIndex={-1}
            className="text-[27px] font-black leading-tight outline-none"
          >
            {product.name.toUpperCase()}
          </h1>
          <p className="mx-auto mt-3 max-w-[340px] text-[15px] font-medium leading-6">
            {product.description}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {productOptions.map((option) => {
            const active = selectedOption?.id === option.id

            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                aria-pressed={active}
                className={`grid min-h-[64px] w-full grid-cols-[40px_1fr_auto_22px] items-center gap-3 rounded-lg border px-4 text-left transition active:scale-[0.99] ${
                  active
                    ? 'border-[#4b160e] bg-[#f2e3cc]'
                    : 'border-[#bfa8a0] bg-white'
                }`}
              >
                <Table2 size={28} strokeWidth={1.8} className="text-[#8b6d63]" />
                <span>
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-[#aa9b96]">{option.detail}</span>
                </span>
                <span className="text-base font-black">{formatCurrency(option.price)}</span>
                <span
                  className={`size-5 rounded-full border ${
                    active ? 'border-[#4b160e] bg-[#4b160e]' : 'border-[#bfa8a0] bg-white'
                  }`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => addCurrentItem(true)}
          className="mx-auto mt-8 flex h-14 w-[86%] items-center justify-center rounded-full bg-[#4b160e] text-base font-black text-white transition active:scale-[0.99]"
        >
          ADICIONAR - {formatCurrency(selectedOption?.price ?? product.price)}
        </button>
      </div>
    </section>
  )
}

function AdminLoginScreen({ error, loading, onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submitLogin(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      return
    }

    onLogin({ email, password })
  }

  return (
    <section className="h-full overflow-hidden bg-white text-[#4b160e]" aria-labelledby="admin-login-title">
      <div className="relative h-[177px] overflow-hidden">
        <img src={cocoBackground} alt="" className="h-full w-full object-cover" draggable="false" />
        <div className="absolute inset-0 bg-black/10" />
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar ao cardapio"
          className="absolute right-7 top-8 grid size-11 place-items-center rounded-full bg-white/85 text-[#4b160e] shadow-lg shadow-black/15 ring-1 ring-white/70 transition active:scale-95"
        >
          <Settings size={25} strokeWidth={2.6} />
        </button>
      </div>

      <div className="relative z-10 -mt-px min-h-[calc(100%-176px)] rounded-t-[18px] bg-white px-11 pt-[185px]">
        <img
          src={cocoLogo}
          alt="Coco Bambu"
          loading="eager"
          decoding="sync"
          className="absolute left-1/2 top-[-94px] size-[200px] -translate-x-1/2 rounded-full border-[12px] border-white bg-[#4b160e]"
          draggable="false"
        />

        <div className="text-center">
          <h1
            id="admin-login-title"
            data-screen-title="true"
            tabIndex={-1}
            className="text-[39px] font-black leading-none outline-none"
          >
            LOGIN
          </h1>
          <p className="mt-4 text-base font-medium uppercase leading-none">ACESSO ADMINISTRATIVO</p>
        </div>

        <form onSubmit={submitLogin} className="mt-9 space-y-3">
          <label className="grid h-[58px] grid-cols-[28px_1fr] items-center gap-3 rounded-[9px] bg-[#eeeeee] px-5 text-[#a9908b]">
            <Mail size={22} strokeWidth={2} />
            <span className="sr-only">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="h-full bg-transparent text-base font-medium text-[#4b160e] outline-none placeholder:text-[#ad9995]"
            />
          </label>

          <label className="grid h-[58px] grid-cols-[28px_1fr] items-center gap-3 rounded-[9px] bg-[#eeeeee] px-5 text-[#a9908b]">
            <LockKeyhole size={22} strokeWidth={2} />
            <span className="sr-only">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              className="h-full bg-transparent text-base font-medium text-[#4b160e] outline-none placeholder:text-[#ad9995]"
            />
          </label>

          {error && (
            <p className="pt-1 text-center text-xs font-bold text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mx-auto !mt-8 flex h-12 w-[247px] max-w-full items-center justify-center rounded-[9px] bg-[#4b160e] text-base font-black text-white transition active:scale-[0.99] disabled:bg-[#8f6b62]"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </section>
  )
}

function SettingsScreen({
  analyticsSummary,
  adminEmail,
  categories,
  copied,
  generatedNfcLink,
  nfcTable,
  products,
  onBack,
  onCopyNfcLink,
  onNfcTableChange,
  onOpenNfcPreview,
  onOpenPartnerLink,
  onLogout,
  onOpenMenuEditor,
}) {
  const [activeTab, setActiveTab] = useState(() => getInitialAdminTab())


  const settingsTabs = [
    { id: 'cardapio', label: 'Cardápio', icon: BadgePlus },
    { id: 'mesas', label: 'Mesas', icon: Nfc },
    { id: 'vezz', label: 'Vezz', icon: BarChart3 },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
  ]

  return (
    <section className="relative h-full overflow-y-auto overflow-x-hidden bg-white pb-8">
      <HeaderBar title="Admin" onBack={onBack} />

      <div className="ml-5 w-[390px] max-w-[calc(100vw-40px)] pt-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-slate-400">Configurações</p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950">
              Gerenciar cardápio
            </h2>
            <p className="mt-1 truncate text-xs font-bold text-slate-400">{adminEmail}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200 transition active:scale-95"
            aria-label="Sair do admin"
            title="Sair"
          >
            <LogOut size={17} strokeWidth={2.4} />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Áreas de administração"
          className="mt-4 grid grid-cols-4 gap-1 border-b border-slate-200"
        >
          {settingsTabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`flex h-11 items-center justify-center gap-1.5 border-b-2 text-[11px] font-black transition ${
                activeTab === id
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <Icon size={15} strokeWidth={2.4} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'cardapio' && (
          <AdminMenuStart
            activeProducts={products.filter((product) => product.active !== false).length}
            categoriesCount={categories.length}
            productsCount={products.length}
            onOpenEditor={onOpenMenuEditor}
            onStartNewProduct={onOpenMenuEditor}
          />
        )}


        {activeTab === 'mesas' && (
          <section className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">Mesa por NFC/QR</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Link pronto para etiqueta ou QR.
                  </p>
                </div>
                <Nfc size={19} className="text-slate-400" />
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <AdminInput
                  label="Mesa"
                  value={nfcTable}
                  placeholder="01"
                  onChange={onNfcTableChange}
                />
                <button
                  type="button"
                  onClick={onOpenNfcPreview}
                  className="mt-[22px] grid size-11 place-items-center rounded-lg bg-slate-950 text-white"
                  aria-label="Abrir link da mesa"
                >
                  <QrCode size={19} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {tableOptions.map((table) => (
                  <button
                    type="button"
                    key={table}
                    onClick={() => onNfcTableChange(table)}
                    aria-pressed={nfcTable === table}
                    className={`h-10 rounded-md text-sm font-black transition active:scale-[0.98] ${
                      nfcTable === table
                        ? 'bg-[#ffda16] text-slate-950'
                        : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">Link gerado</p>
              <p className="mt-2 line-clamp-2 break-all text-[11px] font-bold leading-5 text-slate-700">
                {generatedNfcLink}
              </p>

              <button
                type="button"
                onClick={onCopyNfcLink}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-black text-slate-950 ring-1 ring-slate-200 transition active:scale-[0.99]"
              >
                {copied ? <CircleCheck size={17} /> : <Clipboard size={17} />}
                {copied ? 'LINK COPIADO' : 'COPIAR LINK'}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'vezz' && (
          <section className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-white/45">Parceria Vezz</p>
                  <h2 className="mt-1 text-xl font-black">Impacto no restaurante</h2>
                </div>
                <CarFront size={22} className="text-[#ffda16]" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <PartnerMetric label="Acessos" value={analyticsSummary.menuOpens} />
                <PartnerMetric label="Cliques" value={analyticsSummary.vezzClicks} />
                <PartnerMetric label="CTR" value={`${analyticsSummary.vezzCtr}%`} />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <PartnerMetric label="Pedidos" value={analyticsSummary.ordersSent} />
                <PartnerMetric label="Ticket médio" value={formatCurrency(analyticsSummary.averageTicket)} />
              </div>

              <button
                type="button"
                onClick={() => onOpenPartnerLink('vezz', partnerLinks.vezz)}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ffda16] text-sm font-black text-slate-950"
              >
                <ExternalLink size={16} />
                ABRIR VEZZ
              </button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-base font-black text-slate-950">Interesse por horário</h2>
              <div className="mt-4 space-y-3">
                {analyticsSummary.hourlyDemand.map(({ hour, count, width }) => (
                  <div key={hour} className="grid grid-cols-[34px_1fr_28px] items-center gap-2">
                    <span className="text-xs font-black text-slate-500">{hour}h</span>
                    <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-slate-950"
                        style={{ width: `${width}%` }}
                      />
                    </span>
                    <span className="text-right text-xs font-black text-slate-500">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'cartao' && (
          <section className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">Cartão físico</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Hub NFC, QR, WhatsApp e acessibilidade.
                  </p>
                </div>
                <CreditCard size={19} className="text-slate-400" />
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-[11px] font-black uppercase text-slate-400">
                  {restaurantName}
                </p>
                <h3 className="mt-2 text-lg font-black text-slate-950">APROXIME SEU CELULAR</h3>
                <div className="mx-auto mt-4 grid size-20 place-items-center rounded-lg bg-white text-slate-950 ring-1 ring-slate-200">
                  <Nfc size={34} />
                </div>
                <p className="mt-4 text-xs font-bold text-slate-500">ou escaneie o QR</p>
                <div className="mx-auto mt-3 grid size-24 place-items-center rounded-lg bg-white ring-1 ring-slate-200">
                  <QrCode size={54} />
                </div>
                <div className="mt-4 space-y-1 text-xs font-black text-slate-700">
                  <p>@nomedorestaurante</p>
                  <p>WhatsApp: (81) 99999-9999</p>
                  <p className="pt-2 text-sm tracking-[0.18em] text-slate-950">????????</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <SettingsRow label="Destino curto" value={cardBaseUrl.replace('https://', '')} />
              <SettingsRow label="Origem" value={`Mesa ${nfcTable || '01'}`} />
              <SettingsRow label="Wi-Fi" value="Adicionar no verso" />
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

function AdminMenuStart({ activeProducts, categoriesCount, productsCount, onOpenEditor, onStartNewProduct }) {
  return (
    <section className="mt-5 space-y-4">
      <button
        type="button"
        onClick={onOpenEditor}
        className="grid w-full grid-cols-[44px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm shadow-slate-200/70 transition active:scale-[0.99]"
      >
        <span className="grid size-11 place-items-center rounded-lg bg-[#4b160e] text-[#d8ad61]">
          <BadgePlus size={21} strokeWidth={2.5} />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-black text-slate-950">Editar cardapio</span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">
            Promocoes, categorias e pratos em uma visao unica.
          </span>
        </span>
        <ChevronRight size={20} className="text-slate-400" />
      </button>

      <div className="grid grid-cols-3 gap-2">
        <AdminStat label="Itens" value={productsCount} />
        <AdminStat label="Ativos" value={activeProducts} />
        <AdminStat label="Categorias" value={categoriesCount} />
      </div>

      <button
        type="button"
        onClick={onStartNewProduct}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-black text-white transition active:scale-[0.99]"
      >
        <Plus size={17} strokeWidth={2.8} />
        ADICIONAR ITEM
      </button>
    </section>
  )
}

function AdminStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase text-slate-400">{label}</p>
    </div>
  )
}

function buildAdminProductDraft(product, fallbackCategory = 'frutos-do-mar') {
  const category = product?.category ?? fallbackCategory
  const options = product?.options?.length
    ? product.options
    : [
        {
          id: 'base',
          label: '1 pessoa',
          detail: 'Porção individual',
          price: product?.price ?? '',
          people: 1,
        },
      ]

  return {
    name: product?.name ?? '',
    category,
    description: product?.description ?? '',
    image: product?.image ?? fallbackImages[category],
    tags: product?.tags ?? [],
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      detail: option.detail,
      people: String(option.people ?? option.label?.match(/\d+/)?.[0] ?? ''),
      price: formatAdminPriceInput(option.price),
    })),
  }
}

function buildAdminProductPayload(draft, currentProduct) {
  const options = draft.options.map((option) => {
    const people = Number(option.people) || null

    return {
      id: option.id,
      label: option.label || `${option.people} ${people === 1 ? 'pessoa' : 'pessoas'}`,
      detail: option.detail,
      price: parseAdminPrice(option.price),
      people,
    }
  })
  const price = options[0]?.price || currentProduct?.price || 0

  return {
    ...(currentProduct ?? {}),
    id: currentProduct?.id ?? `admin-${Date.now()}`,
    category: draft.category,
    name: draft.name.trim(),
    price,
    image: draft.image || fallbackImages[draft.category],
    badge: currentProduct?.badge ?? 'Admin',
    badgeTone: currentProduct?.badgeTone ?? 'border-slate-200 bg-white text-slate-600',
    badgeIcon: currentProduct?.badgeIcon ?? Save,
    badgeIconTone: currentProduct?.badgeIconTone ?? 'text-slate-600',
    description: draft.description.trim() || 'Item cadastrado pelo administrador do cardápio.',
    tags: draft.tags.length ? draft.tags : ['Cadastro admin', 'Disponível', 'Novo item'],
    options,
    active: currentProduct?.active !== false,
  }
}

function parseAdminPrice(value) {
  const normalizedValue = String(value ?? '')
    .replace(/[R$\s.]/g, '')
    .replace(',', '.')

  return Number(normalizedValue) || 0
}

function formatAdminPriceInput(value) {
  if (value === '' || value === null || value === undefined) return ''

  return String(value).replace('.', ',')
}

function getAllergenIcon(label) {
  const normalizedLabel = normalizeText(label)

  if (normalizedLabel.includes('ovo')) return 'O'
  if (normalizedLabel.includes('gluten')) return 'G'
  if (normalizedLabel.includes('peixe')) return 'P'
  if (normalizedLabel.includes('lactose')) return 'L'
  if (normalizedLabel.includes('crustaceos')) return 'C'
  if (normalizedLabel.includes('castanhas')) return 'N'
  if (normalizedLabel.includes('soja')) return 'S'

  return '+'
}

function AdminMenuEditor({
  categories,
  products,
  promoItems = promoSlides,
  restaurantProfile = defaultRestaurantProfile,
  onAddAdminItem,
  onBack,
  onDone,
  onRemoveProduct,
  onToggleProductActive,
  onUpdatePromos,
  onUpdateProduct,
}) {
  const [editorView, setEditorView] = useState('home')
  const [editorProfile, setEditorProfile] = useState(restaurantProfile)
  const [editorPromos, setEditorPromos] = useState(promoItems)
  const [editorCategories, setEditorCategories] = useState(categories)
  const [editingPromoId, setEditingPromoId] = useState('')
  const [editingProductId, setEditingProductId] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [productReturnView, setProductReturnView] = useState('home')
  const [profileEditorOpen, setProfileEditorOpen] = useState(false)
  const [editorActionsOpen, setEditorActionsOpen] = useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  function editProduct(product, returnView = 'home') {
    setEditingProductId(product.id)
    setEditingCategoryId(product.category)
    setProductReturnView(returnView)
    setEditorView('product')
  }

  function editPromo(slide) {
    setEditingPromoId(slide.id)
    setEditorView('promo')
  }

  function addPromo() {
    const nextPromo = {
      id: `admin-promo-${Date.now()}`,
      image: promoShrimp,
      alt: 'Novo card promocional',
      fit: 'contain',
    }

    setEditorPromos((items) => [...items, nextPromo])
    setEditingPromoId(nextPromo.id)
    setEditorView('promo')
  }

  function savePromo(updatedPromo) {
    const nextPromos = editorPromos.map((item) => (item.id === updatedPromo.id ? { ...item, ...updatedPromo } : item))

    setEditorPromos(nextPromos)
    onUpdatePromos?.(nextPromos)
    setEditingPromoId('')
    onDone(editorProfile)
  }

  function requestRemovePromo(slide) {
    setPendingDelete({
      title: 'Voce tem certeza que deseja excluir?',
      onConfirm: () => {
        setEditorPromos((items) => items.filter((item) => item.id !== slide.id))
        setPendingDelete(null)
      },
    })
  }

  function startNewProduct(returnView = 'home', categoryId = editingCategoryId) {
    setEditingProductId('')
    setEditingCategoryId(categoryId)
    setProductReturnView(returnView)
    setEditorView('product')
  }

  function closeProductEditor() {
    setEditingProductId('')
    setEditorView(productReturnView)
  }

  function saveProduct(productPayload) {
    if (editingProductId) {
      onUpdateProduct(productPayload)
    } else {
      onAddAdminItem(productPayload)
    }

    onDone(editorProfile)
  }

  function saveEditorProfile() {
    onUpdatePromos?.(editorPromos)
    onDone(editorProfile)
  }

  function openExitConfirmation() {
    setEditorActionsOpen(false)
    setExitConfirmOpen(true)
  }

  function requestRemoveProduct(product) {
    setPendingDelete({
      title: 'Voce tem certeza que deseja excluir?',
      onConfirm: () => {
        onRemoveProduct(product.id)
        setPendingDelete(null)
      },
    })
  }

  function openCategoryProducts(categoryId) {
    setEditingCategoryId(categoryId)
    setEditorView('category-products')
  }

  function openCategoriesEditor() {
    setEditingCategoryId('')
    setEditorView('categories')
  }

  function addCategory() {
    const nextCategory = {
      id: `admin-category-${Date.now()}`,
      label: 'Nova Categoria',
      shortLabel: 'Nova',
      iconImage: iconEntradas,
      image: categoriaEntradas,
    }

    setEditorCategories((items) => [...items, nextCategory])
  }

  function requestRemoveCategory(category) {
    setPendingDelete({
      title: 'Voce tem certeza que deseja excluir?',
      onConfirm: () => {
        setEditorCategories((items) => items.filter((item) => item.id !== category.id))
        setPendingDelete(null)
      },
    })
  }

  const editingProduct = products.find((product) => product.id === editingProductId) ?? null
  const editingPromo = editorPromos.find((slide) => slide.id === editingPromoId) ?? editorPromos[0]
  const editingCategory =
    editorCategories.find((category) => category.id === editingCategoryId) ?? editorCategories[0] ?? categories[0]
  const adminFeaturedProducts = products.slice(0, 5)
  const adminDailyProducts = products
    .filter((product) => !adminFeaturedProducts.some((featuredProduct) => featuredProduct.id === product.id))
    .slice(0, 4)
  const deleteDialog = pendingDelete && (
    <AdminConfirmDialog
      title={pendingDelete.title}
      confirmLabel="Excluir"
      onCancel={() => setPendingDelete(null)}
      onConfirm={pendingDelete.onConfirm}
    />
  )

  if (editorView === 'product') {
    return (
      <div className="relative h-full">
        <AdminProductEditScreen
          categories={editorCategories}
          fallbackCategory={editingCategory.id}
          product={editingProduct}
          restaurantProfile={editorProfile}
          onBack={closeProductEditor}
          onSave={saveProduct}
        />
      </div>
    )
  }

  if (editorView === 'promo') {
    return (
      <div className="relative h-full">
        <AdminPromoEditScreen
          promo={editingPromo}
          restaurantProfile={editorProfile}
          onBack={() => setEditorView('home')}
          onSave={savePromo}
        />
      </div>
    )
  }

  if (editorView === 'categories') {
    return (
      <div className="relative h-full">
        <AdminCategoriesEditorScreen
          categories={editorCategories}
          restaurantProfile={editorProfile}
          onAddCategory={addCategory}
          onBack={() => setEditorView('home')}
          onEditCategory={(category) => openCategoryProducts(category.id)}
          onRemoveCategory={requestRemoveCategory}
        />
        {deleteDialog}
      </div>
    )
  }

  if (editorView === 'category-products') {
    return (
      <div className="relative h-full">
        <AdminCategoryProductsEditorScreen
          category={editingCategory}
          products={products.filter((product) => product.category === editingCategory.id)}
          restaurantProfile={editorProfile}
          onAddProduct={() => startNewProduct('category-products', editingCategory.id)}
          onBack={openCategoriesEditor}
          onEditProduct={(product) => editProduct(product, 'category-products')}
          onRemoveProduct={requestRemoveProduct}
        />
        {deleteDialog}
      </div>
    )
  }

  return (
    <section className="relative h-full overflow-y-auto overflow-x-hidden bg-white pb-8 text-[#4b160e]">
      <div className="sticky top-0 h-[142px]">
        <img src={editorProfile.cover} alt="" className="h-full w-full object-cover" draggable="false" />
        <div className="absolute inset-0 bg-black/10" />
        <button
          type="button"
          onClick={() => setProfileEditorOpen(true)}
          className="absolute bottom-3 left-5 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-bold text-[#6b433a] shadow-md shadow-black/10"
        >
          <Camera size={15} />
          Trocar capa
        </button>
        <div className="absolute right-5 top-9 z-50">
          <button
            type="button"
            onClick={() => setEditorActionsOpen((currentValue) => !currentValue)}
            className="grid size-11 place-items-center rounded-full bg-white/85 text-[#4b160e] shadow-lg shadow-black/15 ring-1 ring-white/70 transition active:scale-95"
            aria-label="Abrir ações do editor"
            aria-expanded={editorActionsOpen}
          >
            <Settings
              size={24}
              strokeWidth={2.6}
              className={`transition-transform duration-500 ease-out ${editorActionsOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          <div
            className={`absolute right-0 top-[52px] z-50 w-[184px] origin-top-right rounded-2xl border border-white/70 bg-white/95 p-2 shadow-xl shadow-[#4b160e]/18 backdrop-blur transition-all duration-300 ease-out ${
              editorActionsOpen
                ? 'translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
          >
            <button
              type="button"
              onClick={saveEditorProfile}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#4b160e] text-xs font-black uppercase tracking-wide text-white"
            >
              <Save size={15} />
              Salvar
            </button>
            <button
              type="button"
              onClick={openExitConfirmation}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#4b160e] bg-white text-xs font-black uppercase tracking-wide text-[#4b160e]"
            >
              <LogOut size={15} />
              Sair / descartar
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-6 rounded-t-[22px] bg-white px-5 pb-8 pt-5 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="grid grid-cols-[128px_1fr] items-start gap-4">
          <div className="relative -mt-16">
            <img
              src={editorProfile.logo}
              alt={editorProfile.name}
              className="size-[116px] rounded-full border-[3px] border-[#d8ad61] bg-[#4b160e] shadow-[0_3px_0_rgba(75,22,14,0.22)]"
              draggable="false"
            />
            <button
              type="button"
              onClick={() => setProfileEditorOpen(true)}
              className="absolute bottom-1 right-3 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700 ring-2 ring-white"
              aria-label="Alterar logo"
            >
              <Camera size={17} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setProfileEditorOpen(true)}
              className="h-8 w-full rounded-lg bg-slate-100 px-4 text-left text-sm font-semibold text-slate-600"
            >
              {editorProfile.name}
            </button>
            <button
              type="button"
              onClick={() => setProfileEditorOpen(true)}
              className="h-8 w-full rounded-lg bg-slate-100 px-4 text-left text-sm font-semibold text-slate-600"
            >
              {editorProfile.location}
            </button>
          </div>
        </div>

        <AdminEditorSectionTitle title="Cards promocao" actionLabel="Adicionar" onAction={addPromo} />
        <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {editorPromos.map((slide) => (
            <div
              key={slide.id}
              className="grid w-[390px] max-w-[calc(100vw-52px)] shrink-0 grid-cols-[1fr_92px] gap-2 rounded-lg bg-slate-100 p-2"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-[108px] w-full rounded-md bg-[#4b160e] object-contain"
                draggable="false"
              />
              <AdminActionStack onEdit={() => editPromo(slide)} onRemove={() => requestRemovePromo(slide)} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-center gap-1.5">
          <span className="size-2 rounded-full bg-slate-300" />
          <span className="size-2 rounded-full bg-slate-300" />
          <span className="size-2 rounded-full bg-slate-300" />
        </div>

        <AdminEditorSectionTitle title="Categorias" actionLabel="Editar" onAction={openCategoriesEditor} />
        <div className="-mx-5 mt-3 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto px-5 pb-2">
            {editorCategories.map((category) => (
              <div key={category.id} className="w-[164px] shrink-0">
                <button
                  type="button"
                  onClick={() => openCategoryProducts(category.id)}
                  className="block w-full overflow-hidden rounded-md bg-slate-100 text-left"
                >
                  <img src={category.image} alt="" className="h-[112px] w-full object-cover" draggable="false" />
                </button>
                <p className="mt-2 truncate text-center text-sm font-black text-[#4b160e]">
                  {category.label.toUpperCase()}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <AdminMiniAction icon={Pencil} label="Editar" onClick={() => openCategoryProducts(category.id)} />
                  <AdminMiniAction icon={Trash2} label="Excluir" onClick={() => requestRemoveCategory(category)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdminEditorSectionTitle title="Destaques" actionLabel="Adicionar" onAction={() => startNewProduct()} />
        <div className="mt-3 space-y-3">
          {adminFeaturedProducts.map((product) => (
            <AdminProductEditorCard
              key={product.id}
              product={product}
              onEdit={() => editProduct(product)}
              onRemove={() => requestRemoveProduct(product)}
              onToggle={() => onToggleProductActive(product.id)}
            />
          ))}
        </div>

        <AdminEditorSectionTitle title="Pratos do dia" actionLabel="Adicionar" onAction={() => startNewProduct()} />
        <div className="mt-3 space-y-3">
          {adminDailyProducts.map((product) => (
            <AdminProductEditorCard
              key={product.id}
              product={product}
              onEdit={() => editProduct(product)}
              onRemove={() => requestRemoveProduct(product)}
              onToggle={() => onToggleProductActive(product.id)}
            />
          ))}
        </div>

      </div>

      {profileEditorOpen && (
        <AdminRestaurantProfileDialog
          profile={editorProfile}
          onCancel={() => setProfileEditorOpen(false)}
          onSave={(nextProfile) => {
            setEditorProfile(nextProfile)
            setProfileEditorOpen(false)
          }}
        />
      )}
      {exitConfirmOpen && (
        <AdminExitConfirmDialog
          onCancel={() => setExitConfirmOpen(false)}
          onDiscard={onBack}
          onSave={saveEditorProfile}
        />
      )}
      {deleteDialog}
    </section>
  )
}

function AdminEditorSectionTitle({ title, actionLabel, onAction }) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <h2 className="text-sm font-black uppercase text-[#4b160e]">{title}</h2>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-100 px-3 text-[11px] font-black text-slate-700 transition active:scale-[0.98]"
        >
          <Plus size={14} strokeWidth={2.8} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function readAdminImageFile(file, onReady) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => onReady(String(reader.result || ''))
  reader.readAsDataURL(file)
}

function AdminRestaurantProfileDialog({ profile, onCancel, onSave }) {
  const [draft, setDraft] = useState(profile)
  const coverInputRef = useRef(null)
  const logoInputRef = useRef(null)

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function updateImage(field, event) {
    const file = event.target.files?.[0]

    readAdminImageFile(file, (imageUrl) => updateField(field, imageUrl))
    event.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/76 px-5 py-8 backdrop-blur-[2px] md:absolute">
      <section className="w-full rounded-[22px] border border-[#4b160e] bg-white p-5 shadow-2xl shadow-[#4b160e]/15">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#4b160e]">Editar restaurante</h2>
            <p className="mt-1 text-xs font-semibold text-[#8b6d66]">
              Atualize as informações exibidas no cardápio.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid size-9 place-items-center rounded-lg bg-slate-100 text-[#6b433a]"
            aria-label="Fechar edição do restaurante"
          >
            x
          </button>
        </div>

        <div className="mt-5">
          <div className="relative overflow-hidden rounded-xl bg-[#4b160e]">
            <img src={draft.cover} alt="" className="h-[132px] w-full object-cover" draggable="false" />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-bold text-[#6b433a] shadow"
            >
              <Camera size={15} />
              Trocar capa
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => updateImage('cover', event)}
            />
          </div>

          <div className="mt-4 grid grid-cols-[88px_1fr] items-center gap-4">
            <div className="relative">
              <img
                src={draft.logo}
                alt=""
                className="size-[88px] rounded-full border-[3px] border-[#d8ad61] bg-[#4b160e] object-cover"
                draggable="false"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-slate-100 text-[#6b433a] ring-2 ring-white"
                aria-label="Trocar logo"
              >
                <Camera size={15} />
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => updateImage('logo', event)}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-[#6b433a]">
                Nome
                <input
                  value={draft.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[#b7928b] px-3 text-sm font-semibold text-[#4b160e] outline-none"
                />
              </label>
              <label className="block text-xs font-black uppercase text-[#6b433a]">
                Localização
                <input
                  value={draft.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[#b7928b] px-3 text-sm font-semibold text-[#4b160e] outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-full border border-[#4b160e] text-sm font-black text-[#4b160e]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-10 rounded-full bg-[#4b160e] text-sm font-black text-white"
          >
            Salvar
          </button>
        </div>
      </section>
    </div>
  )
}

function AdminExitConfirmDialog({ onCancel, onDiscard, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/76 px-7 backdrop-blur-[2px] md:absolute">
      <section className="w-full rounded-[22px] border border-[#4b160e] bg-white px-6 py-6 text-center shadow-2xl shadow-[#4b160e]/15">
        <h2 className="text-xl font-black leading-7 text-[#5a2a22]">Salvar alterações antes de sair?</h2>
        <p className="mt-2 text-sm font-semibold leading-5 text-[#8b6d66]">
          Você pode publicar as mudanças agora ou voltar ao cardápio sem aplicar.
        </p>
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onSave}
            className="h-11 w-full rounded-full bg-[#4b160e] text-sm font-black uppercase tracking-wide text-white"
          >
            Salvar e sair
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="h-10 w-full rounded-full border border-[#4b160e] bg-white text-sm font-black uppercase tracking-wide text-[#4b160e]"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-full rounded-full bg-slate-100 text-sm font-black uppercase tracking-wide text-slate-600"
          >
            Continuar editando
          </button>
        </div>
      </section>
    </div>
  )
}

function AdminActionStack({ disabled = false, onEdit, onRemove }) {
  return (
    <div className="grid content-center gap-2">
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Trash2 size={16} />
        Excluir
      </button>
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Pencil size={16} />
        Editar
      </button>
    </div>
  )
}

function AdminMiniAction({ icon: Icon, label, disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 items-center justify-center gap-1 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Icon size={13} />
      {label}
    </button>
  )
}

function AdminProductEditorCard({ product, onEdit, onRemove, onToggle }) {
  return (
    <article className="grid min-h-[116px] grid-cols-[118px_1fr_98px] gap-3 rounded-lg bg-slate-100 p-2">
      <img
        src={product.image}
        alt=""
        className="h-full min-h-[100px] rounded-md object-cover"
        draggable="false"
      />
      <div className="min-w-0 py-1">
        <h3 className="line-clamp-2 text-sm font-black leading-tight text-[#4b160e]">
          {product.name.toUpperCase()}
        </h3>
        <p className="mt-1 line-clamp-3 text-[12px] font-semibold leading-4 text-[#4b2a22]">
          {product.description}
        </p>
        <p className="mt-1 text-sm font-black text-[#4b160e]">{formatCurrency(product.price)}</p>
      </div>
      <div className="grid content-center gap-2">
        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600"
        >
          <Trash2 size={15} />
          Excluir
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600"
        >
          <Pencil size={15} />
          Editar
        </button>
        <button
          type="button"
          onClick={onToggle}
          className={`h-8 rounded-lg text-[10px] font-black ${
            product.active === false ? 'bg-white text-slate-500' : 'bg-[#4b160e] text-white'
          }`}
        >
          {product.active === false ? 'INATIVO' : 'ATIVO'}
        </button>
      </div>
    </article>
  )
}

function AdminPromoEditScreen({ promo, restaurantProfile = defaultRestaurantProfile, onBack, onSave }) {
  const [draft, setDraft] = useState(() => ({
    ...promo,
    alt: promo?.alt ?? 'Card promocional',
  }))
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)
  const imageInputRef = useRef(null)

  function updatePromoImage(event) {
    const file = event.target.files?.[0]

    readAdminImageFile(file, (imageUrl) => {
      setDraft((current) => ({ ...current, image: imageUrl, fit: 'contain' }))
    })
    event.target.value = ''
  }

  return (
    <section className="relative h-full overflow-y-auto overflow-x-hidden bg-white pb-7 text-[#4b160e]">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onBack} compact />

      <div className="relative z-10 -mt-9 rounded-t-[22px] bg-white px-8 pb-8 pt-7 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="relative overflow-hidden rounded-lg bg-[#4b160e]">
          <img
            src={draft.image}
            alt=""
            className="h-[178px] w-full object-contain"
            draggable="false"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-bold text-[#8f746d] shadow"
          >
            <Camera size={15} />
            Trocar foto
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={updatePromoImage}
          />
        </div>

        <label className="mt-4 block text-sm font-black text-[#6b433a]">
          Nome do card
          <input
            value={draft.alt}
            onChange={(event) => setDraft((current) => ({ ...current, alt: event.target.value }))}
            className="mt-1 h-10 w-full rounded-lg border border-[#b7928b] px-3 text-sm font-semibold text-[#4b160e] outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => setSaveConfirmOpen(true)}
          className="mx-auto mt-6 flex h-10 w-[90%] items-center justify-center rounded-full bg-[#4b160e] text-base font-semibold text-white"
        >
          Salvar alterações
        </button>
      </div>

      {saveConfirmOpen && (
        <AdminConfirmDialog
          title="Você tem certeza que deseja salvar as alterações?"
          confirmLabel="Salvar"
          onCancel={() => setSaveConfirmOpen(false)}
          onConfirm={() => onSave(draft)}
        />
      )}
    </section>
  )
}

function AdminProductEditScreen({ categories, fallbackCategory, product, restaurantProfile = defaultRestaurantProfile, onBack, onSave }) {
  const [draft, setDraft] = useState(() => buildAdminProductDraft(product, fallbackCategory || categories[0]?.id))
  const [allergenOpen, setAllergenOpen] = useState(false)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)
  const [deleteOptionId, setDeleteOptionId] = useState('')
  const [optionDraft, setOptionDraft] = useState(null)
  const imageInputRef = useRef(null)
  const previewImage = draft.image || fallbackImages[draft.category] || categoriaFrutosDoMar

  function updateDraftField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function updateProductImage(event) {
    const file = event.target.files?.[0]

    readAdminImageFile(file, (imageUrl) => updateDraftField('image', imageUrl))
    event.target.value = ''
  }

  function toggleTag(tag) {
    setDraft((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }))
  }

  function removeTag(tag) {
    setDraft((current) => ({
      ...current,
      tags: current.tags.filter((item) => item !== tag),
    }))
  }

  function editOption(option) {
    setOptionDraft({ ...option })
  }

  function startOption() {
    setOptionDraft({
      id: `opt-${Date.now()}`,
      people: '',
      detail: '',
      price: '',
    })
  }

  function concludeOption() {
    if (!optionDraft?.people || !optionDraft?.price) return

    setDraft((current) => {
      const exists = current.options.some((option) => option.id === optionDraft.id)
      const nextOption = {
        ...optionDraft,
        label: `${optionDraft.people} ${Number(optionDraft.people) === 1 ? 'pessoa' : 'pessoas'}`,
      }

      return {
        ...current,
        options: exists
          ? current.options.map((option) => (option.id === optionDraft.id ? nextOption : option))
          : [...current.options, nextOption],
      }
    })
    setOptionDraft(null)
  }

  function removeOption(optionId) {
    setDraft((current) => ({
      ...current,
      options: current.options.filter((option) => option.id !== optionId),
    }))
    setDeleteOptionId('')
  }

  function confirmSave() {
    onSave(buildAdminProductPayload(draft, product))
  }

  return (
    <section className="relative h-full overflow-y-auto overflow-x-hidden bg-white pb-7 text-[#4b160e]">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onBack} compact />

      <div className="relative z-10 -mt-9 rounded-t-[22px] bg-white px-8 pb-8 pt-7 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="relative overflow-hidden rounded-lg bg-[#4b160e]">
          <img
            src={previewImage}
            alt=""
            className="h-[178px] w-full object-cover"
            draggable="false"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-bold text-[#8f746d] shadow"
          >
            <Camera size={15} />
            Trocar foto
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={updateProductImage}
          />
        </div>

        <label className="mt-3 block text-sm font-black text-[#6b433a]">
          Nome do prato
          <input
            value={draft.name}
            onChange={(event) => updateDraftField('name', event.target.value)}
            placeholder="Nome do prato"
            className="mt-1 h-10 w-full rounded-lg border border-[#b7928b] px-3 text-sm font-semibold text-[#4b160e] outline-none"
          />
        </label>

        <label className="mt-3 block text-sm font-black text-[#6b433a]">
          Descrição
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField('description', event.target.value)}
            placeholder="Descrição do prato"
            className="mt-1 h-[112px] w-full resize-none rounded-lg border border-[#b7928b] px-3 py-3 text-sm font-semibold leading-5 text-[#6b433a] outline-none"
          />
        </label>

        <div className="mt-4">
          <h2 className="text-sm font-black text-[#6b433a]">Alergênicos</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.tags.map((tag) => (
              <AdminAllergenChip key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
            <button
              type="button"
              onClick={() => setAllergenOpen(true)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#b7928b] px-3 text-xs font-bold text-[#8b6d66]"
            >
              Adicionar
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-black text-[#6b433a]">Opções de porções e preços</h2>
          <div className="mt-2 space-y-2">
            {draft.options.map((option) => (
              <AdminPortionOptionRow
                key={option.id}
                option={option}
                onEdit={() => editOption(option)}
                onRemove={() => setDeleteOptionId(option.id)}
              />
            ))}

            {optionDraft && (
              <div className="grid grid-cols-[1fr_1.2fr_1.2fr_auto] gap-2 rounded-lg border border-[#b7928b] bg-[#f5e7d2] p-2">
                <label className="text-[11px] font-semibold">
                  Pessoas
                  <input
                    value={optionDraft.people}
                    onChange={(event) => setOptionDraft((current) => ({ ...current, people: event.target.value }))}
                    className="mt-1 h-8 w-full rounded border border-[#b7928b] px-2 text-sm outline-none"
                  />
                </label>
                <label className="text-[11px] font-semibold">
                  Peso
                  <input
                    value={optionDraft.detail}
                    onChange={(event) => setOptionDraft((current) => ({ ...current, detail: event.target.value }))}
                    className="mt-1 h-8 w-full rounded border border-[#b7928b] px-2 text-sm outline-none"
                  />
                </label>
                <label className="text-[11px] font-semibold">
                  Preço
                  <input
                    value={optionDraft.price}
                    onChange={(event) => setOptionDraft((current) => ({ ...current, price: event.target.value }))}
                    className="mt-1 h-8 w-full rounded border border-[#b7928b] px-2 text-sm outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={concludeOption}
                  className="mt-[18px] h-9 rounded-lg bg-[#4b160e] px-3 text-xs font-bold text-white"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={startOption}
          className="mx-auto mt-4 flex h-10 w-[90%] items-center justify-center gap-2 rounded-full bg-[#4b160e] text-base font-semibold text-white"
        >
          Adicionar
          <Plus size={18} />
        </button>
        <button
          type="button"
          onClick={() => setSaveConfirmOpen(true)}
          className="mx-auto mt-2 flex h-10 w-[90%] items-center justify-center rounded-full border border-[#4b160e] bg-white text-base font-semibold text-[#4b160e]"
        >
          Salvar alterações
        </button>
      </div>

      {allergenOpen && (
        <AdminAllergenDialog
          selectedTags={draft.tags}
          onClose={() => setAllergenOpen(false)}
          onToggle={toggleTag}
        />
      )}
      {deleteOptionId && (
        <AdminConfirmDialog
          title="Você tem certeza que deseja excluir?"
          confirmLabel="Excluir"
          onCancel={() => setDeleteOptionId('')}
          onConfirm={() => removeOption(deleteOptionId)}
        />
      )}
      {saveConfirmOpen && (
        <AdminConfirmDialog
          title="Você tem certeza que deseja salvar as alterações?"
          confirmLabel="Salvar"
          onCancel={() => setSaveConfirmOpen(false)}
          onConfirm={confirmSave}
        />
      )}
    </section>
  )
}

function AdminCategoriesEditorScreen({
  categories,
  restaurantProfile = defaultRestaurantProfile,
  onAddCategory,
  onBack,
  onEditCategory,
  onRemoveCategory,
}) {
  return (
    <section className="relative h-full overflow-y-auto bg-white pb-8 text-[#4b160e]">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onBack} compact />
      <div className="relative z-10 -mt-9 rounded-t-[22px] bg-white px-5 pt-6 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <img
          src={restaurantProfile.logo}
          alt={restaurantProfile.name}
          className="relative z-20 mx-auto -mt-20 size-[112px] rounded-full border-4 border-[#d8ad61] bg-[#4a160f]"
          draggable="false"
        />
        <h1 data-screen-title="true" tabIndex={-1} className="mt-2 text-center text-xl font-medium outline-none">
          CATEGORIAS
        </h1>
        <button
          type="button"
          onClick={onAddCategory}
          className="mx-auto mt-4 flex h-10 w-[66%] items-center justify-center gap-2 rounded-full bg-[#4b160e] text-sm font-black text-[#d8ad61]"
        >
          <Plus size={17} />
          ADICIONAR CATEGORIA
        </button>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg bg-[#f4f4f4] p-2 text-center">
              <button
                type="button"
                onClick={() => onEditCategory(category)}
                className="relative block w-full pb-7"
              >
                <span className="block aspect-[154/107] overflow-hidden rounded-lg border-[3px] border-[#4b160e] bg-white">
                  <img src={category.image} alt="" className="block size-full object-cover" draggable="false" />
                </span>
                <span className="absolute bottom-0 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full border-2 border-[#d8ad61] bg-[#4b160e]">
                  <img src={category.iconImage} alt="" className="w-8" draggable="false" />
                </span>
              </button>
              <p className="mt-1 h-9 text-sm font-black leading-tight">{category.label.toUpperCase()}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <AdminMiniAction icon={Pencil} label="Editar" onClick={() => onEditCategory(category)} />
                <AdminMiniAction icon={Trash2} label="Excluir" onClick={() => onRemoveCategory(category)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AdminCategoryProductsEditorScreen({
  category,
  products,
  restaurantProfile = defaultRestaurantProfile,
  onAddProduct,
  onBack,
  onEditProduct,
  onRemoveProduct,
}) {
  const groupedProducts = groupProductsByMenuSection(products, category)

  return (
    <section className="relative h-full overflow-y-auto bg-white pb-8 text-[#43160f]">
      <TopPhotoBar backgroundImage={restaurantProfile.cover} onBack={onBack} onOpenSettings={onBack} compact />
      <div className="relative z-10 -mt-7 rounded-t-[26px] bg-white px-4 pb-8 pt-[70px] shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        <div className="absolute left-1/2 top-[-70px] grid size-[126px] -translate-x-1/2 place-items-center rounded-full border-4 border-[#d8ad61] bg-[#4b160e] shadow-[0_9px_0_rgba(75,22,14,0.18),0_18px_34px_rgba(67,22,15,0.20)] ring-[5px] ring-white">
          <img src={category.iconImage} alt="" className="w-[78px]" draggable="false" />
        </div>

        <h1 data-screen-title="true" tabIndex={-1} className="text-center text-[22px] font-black outline-none">
          {category.label.toUpperCase()}
        </h1>
        <button
          type="button"
          onClick={onAddProduct}
          className="mx-auto mt-3 flex h-9 w-[68%] items-center justify-center gap-2 rounded-full bg-[#4b160e] text-xs font-black text-[#d8ad61]"
        >
          <Plus size={15} />
          ADICIONAR PRATO
        </button>

        <div className="mt-5 space-y-5">
          {groupedProducts.length ? (
            groupedProducts.map((group) => (
              <section key={group.title}>
                <h2 className="mb-2 px-1 text-[17px] font-black">{group.title}</h2>
                <div className="space-y-2.5">
                  {group.products.map((product) => (
                    <AdminCategoryProductCard
                      key={product.id}
                      product={product}
                      onEdit={() => onEditProduct(product)}
                      onRemove={() => onRemoveProduct(product)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="rounded-lg bg-[#f0f0f0] p-4 text-sm font-bold text-[#7d6259]">
              Nenhum prato cadastrado nesta categoria.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function AdminCategoryProductCard({ product, onEdit, onRemove }) {
  return (
    <article className="grid min-h-[112px] grid-cols-[118px_1fr_96px] gap-2 rounded-lg bg-[#f0f0f0] p-2">
      <img src={product.image} alt="" className="h-[96px] rounded-md object-cover" draggable="false" />
      <div className="min-w-0 py-1">
        <h3 className="line-clamp-2 text-[13px] font-black leading-tight">{product.name.toUpperCase()}</h3>
        <p className="mt-1 line-clamp-3 text-[11px] font-medium leading-[14px]">{product.description}</p>
        <p className="mt-1 text-sm font-black">{formatCurrency(product.price)}</p>
      </div>
      <div className="grid content-center gap-2">
        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600"
        >
          <Trash2 size={15} />
          Excluir
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-200 text-xs font-bold text-slate-600"
        >
          <Pencil size={15} />
          Editar
        </button>
      </div>
    </article>
  )
}

function AdminPortionOptionRow({ option, onEdit, onRemove }) {
  return (
    <article className="grid min-h-[64px] grid-cols-[42px_1fr_auto_auto_auto] items-center gap-2 rounded-lg border border-[#b7928b] bg-white p-2">
      <Table2 size={25} className="text-[#7d5148]" />
      <div className="min-w-0">
        <h3 className="text-sm font-black">{option.label}</h3>
        <p className="truncate text-xs font-semibold text-[#9d817a]">{option.detail}</p>
      </div>
      <p className="whitespace-nowrap text-sm font-black">{formatCurrency(parseAdminPrice(option.price))}</p>
      <button
        type="button"
        onClick={onEdit}
        className="grid size-9 place-items-center rounded-lg border border-[#b7928b] text-[#7d5148]"
        aria-label="Editar porção"
      >
        <Pencil size={18} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="grid size-9 place-items-center rounded-lg border border-[#b7928b] text-[#7d5148]"
        aria-label="Excluir porção"
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}

function AdminAllergenDialog({ selectedTags, onClose, onToggle }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 px-5 backdrop-blur-[1px]">
      <section className="w-full rounded-2xl border border-[#4b160e] bg-white px-4 py-5 text-center shadow-xl">
        <h2 className="text-xl font-black text-[#6b433a]">Alergênicos</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {allergenOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => onToggle(option.id)}
              aria-pressed={selectedTags.includes(option.id)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-base font-semibold ${
                selectedTags.includes(option.id)
                  ? 'border-[#4b160e] bg-white text-[#6b433a]'
                  : 'border-transparent bg-slate-100 text-[#8e8e8e]'
              }`}
            >
              <span className="grid size-7 place-items-center rounded-full bg-[#fff2df] text-[13px]">
                {getAllergenIcon(option.id)}
              </span>
              {option.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-5 flex h-9 w-32 items-center justify-center rounded-full bg-[#4b160e] text-base font-semibold text-white"
        >
          Salvar
        </button>
      </section>
    </div>
  )
}

function AdminAllergenChip({ label, onRemove }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full bg-slate-100 px-2 text-xs font-semibold text-[#8b6d66]">
      <span className="grid size-6 place-items-center rounded-full bg-[#fff2df] text-[11px]">{getAllergenIcon(label)}</span>
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-4 place-items-center rounded-full bg-slate-300 text-[10px] font-black text-white"
        aria-label={`Remover ${label}`}
      >
        x
      </button>
    </span>
  )
}

function AdminConfirmDialog({ title, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/72 px-8 backdrop-blur-[1px] md:absolute">
      <section className="w-full rounded-2xl border border-[#4b160e] bg-white px-7 py-6 text-center shadow-xl">
        <h2 className="text-lg font-black leading-7 text-[#6b433a]">{title}</h2>
        <div className="mt-5 flex justify-center gap-6">
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 min-w-[112px] rounded bg-[#4b160e] px-5 text-base font-semibold text-white"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-10 min-w-[112px] rounded border border-[#4b160e] px-5 text-base font-semibold text-[#4b160e]"
          >
            Cancelar
          </button>
        </div>
      </section>
    </div>
  )
}

function AdminProductFormModal({ categories, editing, form, onCancel, onChange, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 px-4 pb-4 pt-12 md:absolute">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[398px] rounded-2xl bg-white p-4 shadow-2xl shadow-slate-950/20"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              {editing ? 'Editar item' : 'Adicionar item'}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Atualize nome, categoria, preco e descricao do prato.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600"
            aria-label="Fechar formulario"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <AdminInput
            label="Nome"
            value={form.name}
            placeholder="Ex.: Camarao Coco Brasil"
            onChange={(value) => onChange((current) => ({ ...current, name: value }))}
          />

          <div className="grid grid-cols-[1fr_104px] gap-3">
            <label className="block text-xs font-black text-slate-600">
              Categoria
              <select
                value={form.category}
                onChange={(event) =>
                  onChange((current) => ({ ...current, category: event.target.value }))
                }
                className="mt-2 h-11 w-full rounded-lg bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <AdminInput
              label="Preco"
              value={form.price}
              placeholder="199,00"
              onChange={(value) => onChange((current) => ({ ...current, price: value }))}
            />
          </div>

          <AdminInput
            label="Ingredientes"
            value={form.ingredients}
            placeholder="Camarao, catupiry, arroz"
            onChange={(value) => onChange((current) => ({ ...current, ingredients: value }))}
          />

          <AdminInput
            label="Descricao"
            value={form.description}
            placeholder="Resumo do item"
            onChange={(value) => onChange((current) => ({ ...current, description: value }))}
          />
        </div>

        <button
          type="submit"
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-black text-white transition active:scale-[0.99]"
        >
          <Save size={17} />
          {editing ? 'SALVAR ALTERACOES' : 'SALVAR ITEM'}
        </button>
      </form>
    </div>
  )
}

function PartnerMetric({ label, value }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <p className="text-lg font-black">{value}</p>
      <p className="mt-1 text-[10px] font-bold text-white/55">{label}</p>
    </div>
  )
}

function SettingsRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-sm font-black text-slate-950">{value}</span>
    </div>
  )
}

function OrderScreen({
  cartItems,
  cartTotal,
  orderSent,
  tableNumber,
  onBack,
  onSendOrder,
  onTableChange,
  onUpdateCartItem,
}) {
  const [customerName, setCustomerName] = useState('')
  const [serviceType, setServiceType] = useState('mesa')
  const [observations, setObservations] = useState('')

  return (
    <section className="h-full overflow-y-auto overflow-x-hidden bg-white pb-8 text-[#4b160e]">
      <TopPhotoBar onBack={onBack} onOpenSettings={() => {}} compact />

      <div className="-mt-9 rounded-t-[36px] bg-white px-5 pb-8 pt-9 shadow-[0_-14px_34px_rgba(67,22,15,0.10)]">
        {orderSent ? (
          <section className="rounded-lg border border-[#eadfd9] bg-white p-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#4b160e] text-white">
              <CircleCheck size={28} />
            </div>
            <h1 className="mt-4 text-xl font-black">Pedido pronto</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-[#7e6258]">
              Mostre esta tela ao garçom para confirmar a mesa {tableNumber || 'selecionada'}.
            </p>
          </section>
        ) : (
          <>
            <div className="flex items-center gap-4 px-2">
              <span className="grid size-14 place-items-center rounded-full bg-[#4b160e] text-white">
                <ReceiptText size={28} />
              </span>
              <div>
                <h1 data-screen-title="true" tabIndex={-1} className="text-lg font-black outline-none">
                  SEU PEDIDO
                </h1>
                <p className="text-sm font-medium">Confirme os itens do seu pedido</p>
              </div>
            </div>

            <section className="mt-5 rounded-lg border border-[#d8c7bf] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="min-w-0 flex-1 text-xs font-black text-[#7e6258]">
                  Nome
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Opcional"
                    className="mt-2 h-10 w-full rounded-md border border-[#eadfd9] px-3 text-sm font-bold text-[#4b160e] outline-none placeholder:text-[#b5a7a2]"
                  />
                </label>
                <label className="w-28 text-xs font-black text-[#7e6258]">
                  Consumo
                  <select
                    value={serviceType}
                    onChange={(event) => setServiceType(event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-[#eadfd9] bg-white px-2 text-sm font-bold text-[#4b160e] outline-none"
                  >
                    <option value="mesa">Mesa</option>
                    <option value="balcao">Balcão</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-6 gap-2" aria-label="Selecionar mesa">
                {tableOptions.map((table) => (
                  <button
                    type="button"
                    key={table}
                    onClick={() => onTableChange(table)}
                    aria-pressed={tableNumber === table}
                    aria-label={`Selecionar mesa ${table}`}
                    className={`h-9 rounded-md text-xs font-black transition active:scale-[0.98] ${
                      tableNumber === table
                        ? 'bg-[#4b160e] text-white'
                        : 'bg-[#f5eee4] text-[#4b160e]'
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4 space-y-3">
              {cartItems.length === 0 ? (
                <p className="rounded-lg border border-[#eadfd9] bg-white p-4 text-sm font-bold text-[#9b837a]">
                  Nenhum item adicionado.
                </p>
              ) : (
                cartItems.map((item) => (
                  <OrderItemCard
                    key={`${item.productId}-${item.optionId}-${item.note}`}
                    item={item}
                    onUpdateCartItem={onUpdateCartItem}
                  />
                ))
              )}
            </section>

            <section className="mt-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#4b160e] text-white">
                  <ReceiptText size={21} />
                </span>
                <h2 className="text-lg font-black">Observações</h2>
              </div>
              <textarea
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                placeholder="Ex.: Caldinho de peixe sem azeitona"
                className="mt-4 h-[68px] w-full resize-none rounded-lg border border-[#d8c7bf] px-4 py-4 text-sm font-semibold text-[#4b160e] outline-none placeholder:text-[#b6a4a0]"
              />
            </section>

            <div className="mt-4 rounded-lg border border-[#4b160e] bg-[#f2e3cc] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 text-lg font-black">
                  <ShoppingCart size={24} />
                  TOTAL
                </span>
                <p className="text-xl font-black">{formatCurrency(cartTotal)}</p>
              </div>
              <button
                type="button"
                onClick={() => onSendOrder({ customerName, serviceType, paymentType: 'garcom', observations })}
                disabled={!cartItems.length || !tableNumber}
                className="mx-auto mt-4 flex h-12 w-[86%] items-center justify-center rounded-full bg-[#4b160e] text-sm font-black text-white transition active:scale-[0.99] disabled:bg-[#b89d94] disabled:text-white/65"
              >
                MOSTRAR AO GARÇOM
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function OrderItemCard({ item, onUpdateCartItem }) {
  const itemPrice = (item.unitPrice ?? item.product.price) * item.quantity
  const detail = item.optionLabel || item.optionDetail || 'Porção'

  return (
    <article className="grid min-h-[112px] grid-cols-[124px_1fr_auto] gap-3 rounded-lg border border-[#d8c7bf] bg-white p-2.5">
      <img
        src={item.product.image}
        alt=""
        aria-hidden="true"
        className="h-[92px] w-full rounded-md object-cover"
      />
      <div className="min-w-0 py-1">
        <h2 className="line-clamp-2 text-sm font-black">{item.product.name.toUpperCase()}</h2>
        <p className="mt-1 text-sm font-medium">{detail}</p>
        <div className="mt-3 inline-flex h-7 items-center rounded-full border border-[#4b160e] bg-[#f7ead7] text-[#4b160e]">
          <button
            type="button"
            onClick={() => onUpdateCartItem(item.productId, item.quantity - 1, item.optionId, item.note)}
            aria-label={`Diminuir quantidade de ${item.product.name}`}
            className="grid h-7 w-8 place-items-center"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <span className="w-9 text-center text-sm font-black">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateCartItem(item.productId, item.quantity + 1, item.optionId, item.note)}
            aria-label={`Aumentar quantidade de ${item.product.name}`}
            className="grid h-7 w-8 place-items-center"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
      <p className="self-center pr-1 text-right text-base font-black">{formatCurrency(itemPrice)}</p>
    </article>
  )
}

function CartBar({ quantity, total, onOpenOrder }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-[#4b160e] p-3 text-white shadow-2xl shadow-black/20">
      <button
        type="button"
        onClick={onOpenOrder}
        aria-label={`Fazer pedido com ${quantity} ${quantity === 1 ? 'item' : 'itens'}, total de ${formatCurrency(total)}`}
        className="flex h-12 w-full items-center justify-between gap-3"
      >
        <span className="flex items-center gap-3">
          <span className="relative grid size-10 place-items-center">
            <ShoppingCart size={18} />
            <span className="absolute -right-1 top-0 grid size-4 place-items-center rounded-full bg-[#f8a91f] text-[10px] font-black text-white">
              {quantity}
            </span>
          </span>
          <span className="text-left">
            <span className="block text-[13px] font-medium">
              {quantity} {quantity === 1 ? 'item' : 'itens'}
            </span>
            <span className="block text-base font-black">{formatCurrency(total)}</span>
          </span>
        </span>
        <span className="rounded-lg bg-[#f8a91f] px-4 py-3 text-xs font-black text-white">
          VER CARRINHO
        </span>
      </button>
    </div>
  )
}
function HeaderBar({ title, onBack }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/95 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-900 transition active:scale-95"
      >
        <ArrowLeft size={21} strokeWidth={2.7} />
      </button>
      <h1 data-screen-title="true" tabIndex={-1} className="text-lg font-black text-slate-900 outline-none">
        {title}
      </h1>
    </header>
  )
}

function AdminInput({ label, value, placeholder, onChange }) {
  return (
    <label className="block text-xs font-black text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200 placeholder:text-slate-400"
      />
    </label>
  )
}

function cancelSpeechQueue() {
  if (
    typeof window === 'undefined' ||
    !window.speechSynthesis
  ) {
    return
  }

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }

  window.speechSynthesis.cancel()
}

function getAnalyticsSession(tableNumber) {
  const storedSession = window.sessionStorage?.getItem(sessionStorageKey)

  if (storedSession) {
    try {
      return JSON.parse(storedSession)
    } catch {
      window.sessionStorage?.removeItem(sessionStorageKey)
    }
  }

  const source = getSourceFromUrl()
  const session = {
    id: crypto.randomUUID(),
    restaurantId,
    cardId: tableNumber ? `mesa_${tableNumber}` : source,
    source,
    startedAt: new Date().toISOString(),
    language: 'pt-BR',
  }

  window.sessionStorage?.setItem(sessionStorageKey, JSON.stringify(session))
  return session
}

function getSourceFromUrl() {
  const params = new URLSearchParams(window.location.search)

  if (params.has('mesa')) return 'nfc'
  if (params.get('source')) return params.get('source')

  return 'direct'
}

function readAnalyticsEvents() {
  try {
    return JSON.parse(window.localStorage?.getItem(analyticsStorageKey) ?? '[]')
  } catch {
    return []
  }
}

function saveAnalyticsEvents(events) {
  window.localStorage?.setItem(analyticsStorageKey, JSON.stringify(events))
}

function buildAnalyticsEvent(eventName, session, payload = {}) {
  return {
    id: crypto.randomUUID(),
    event: eventName,
    restaurantId,
    sessionId: session.id,
    cardId: session.cardId,
    source: session.source,
    createdAt: new Date().toISOString(),
    ...payload,
  }
}

function buildOrderRecord({ analyticsSession, cartItems, cartTotal, orderData, tableNumber }) {
  return {
    id: crypto.randomUUID(),
    restaurantId,
    sessionId: analyticsSession.id,
    tableNumber: tableNumber || '',
    serviceType: orderData.serviceType ?? 'mesa',
    paymentType: orderData.paymentType ?? 'caixa',
    customerName: orderData.customerName?.trim() || '',
    observations: orderData.observations?.trim() || '',
    status: 'received',
    cartQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal,
    clientCreatedAt: new Date().toISOString(),
    items: cartItems.map((item) => {
      const unitPrice = item.unitPrice ?? item.product.price

      return {
        productId: item.productId,
        name: item.product.name,
        optionId: item.optionId,
        optionLabel: item.optionLabel,
        optionDetail: item.optionDetail,
        people: item.people,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        note: item.note,
      }
    }),
  }
}

function buildAnalyticsSummary(events, products, session) {
  const eventCount = (eventName) => events.filter((event) => event.event === eventName).length
  const menuOpens = Math.max(eventCount('menu_open'), 1)
  const vezzClicks = eventCount('vezz_click')
  const orderEvents = events.filter((event) => event.event === 'order_sent')
  const hourlyCounts = Array.from({ length: 6 }, (_, index) => {
    const hour = 18 + index
    const count = events.filter((event) => {
      const eventHour = new Date(event.createdAt).getHours()
      return eventHour === hour
    }).length

    return { hour, count }
  })
  const maxHourlyCount = Math.max(...hourlyCounts.map((item) => item.count), 1)

  return {
    menuOpens,
    vezzClicks,
    uniqueSessions: new Set(events.map((event) => event.sessionId)).size || 1,
    productViews: eventCount('product_view'),
    productAdds: eventCount('product_add'),
    activeProducts: products.filter((product) => product.active !== false).length,
    totalProducts: products.length,
    ordersSent: orderEvents.length,
    averageTicket: orderEvents.length
      ? orderEvents.reduce((total, event) => total + Number(event.cartTotal ?? 0), 0) / orderEvents.length
      : 0,
    cardId: session.cardId,
    source: session.source,
    vezzCtr: ((vezzClicks / menuOpens) * 100).toFixed(1).replace('.', ','),
    hourlyDemand: hourlyCounts.map((item) => ({
      ...item,
      width: Math.max(8, Math.round((item.count / maxHourlyCount) * 100)),
    })),
  }
}

function filterProducts(products, query) {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) return products

  const withoutMatch = normalizedQuery.match(/\bsem\s+(.+)/)

  if (withoutMatch) {
    const blockedTerms = withoutMatch[1].split(/\s+/).filter(Boolean)

    return products.filter((product) => {
      const searchable = normalizeText(`${product.name} ${product.description} ${product.tags.join(' ')}`)
      return blockedTerms.every((term) => !searchable.includes(term))
    })
  }

  const terms = normalizedQuery
    .split(/\s+/)
    .filter((term) => term.length > 1 && !['com', 'para', 'quero', 'mostrar'].includes(term))

  return products.filter((product) => {
    const searchable = normalizeText(`${product.name} ${product.description} ${product.tags.join(' ')}`)
    return terms.every((term) => searchable.includes(term))
  })
}

function findProductByCommand(products, command) {
  return products.find((product) => {
    const productName = normalizeText(product.name)
    const productTerms = productName.split(/\s+/).filter((term) => term.length > 2)

    return command.includes(productName) || productTerms.every((term) => command.includes(term))
  })
}

function groupProductsByMenuSection(products, category) {
  const groups = products.reduce((currentGroups, product) => {
    const title = getProductMenuSection(product, category)

    if (!currentGroups.has(title)) {
      currentGroups.set(title, [])
    }

    currentGroups.get(title).push(product)
    return currentGroups
  }, new Map())

  return Array.from(groups, ([title, groupProducts]) => ({
    title,
    products: groupProducts,
  }))
}

function getProductMenuSection(product, category) {
  const productName = normalizeText(product.name)

  if (category.id === 'frutos-do-mar') {
    if (productName.includes('camarao')) return 'CAMARÃO'
    if (productName.includes('lagosta')) return 'LAGOSTA'
    if (productName.includes('peixe') || productName.includes('caldinho')) return 'PEIXES'
  }

  if (category.id === 'carnes') return 'CARNES'
  if (category.id === 'entradas') return 'ENTRADAS'
  if (category.id === 'saladas') return 'SALADAS'
  if (category.id === 'frangos') return 'FRANGOS'
  if (category.id === 'veganos') return 'VEGANOS'
  if (category.id === 'sobremesas') return 'SOBREMESAS'
  if (category.id === 'bebidas') return 'BEBIDAS'

  return category.label.toUpperCase()
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function getTableFromUrl() {
  return new URLSearchParams(window.location.search).get('mesa') ?? ''
}

function getInitialScreen() {
  const hash = window.location.hash

  if (hash.startsWith('#produto=')) return 'produto'
  if (hash.startsWith('#categoria=')) return 'categoria-pratos'
  if (hash === '#pedido') return 'pedido'
  if (hash === '#menu') return 'menu'
  if (hash === '#categorias') return 'categorias'
  if (hash.startsWith('#configuracoes')) return 'configuracoes'
  if (hash.startsWith('#admin-cardapio')) return 'admin-cardapio'

  return 'menu'
}

function getCategoryFromHash() {
  const categoryId = window.location.hash.replace('#categoria=', '')

  return categories.some((category) => category.id === categoryId)
    ? categoryId
    : ''
}

function getInitialAdminTab() {
  const tab = new URLSearchParams(window.location.search).get('adminTab')
  const validTabs = ['cardapio', 'mesas', 'vezz', 'cartao']

  return validTabs.includes(tab) ? tab : 'cardapio'
}

function getProductFromHash() {
  const productId = window.location.hash.replace('#produto=', '')
  return baseProducts.some((product) => product.id === productId)
    ? productId
    : baseProducts[0].id
}

function buildNfcUrl(tableNumber) {
  const url = new URL(window.location.href)
  url.searchParams.set('mesa', tableNumber)
  url.hash = 'menu'
  return url.toString()
}

function buildProductAriaLabel(product) {
  return `${product.name}. ${formatCurrency(product.price)}. Ingredientes principais: ${product.tags.join(', ')}. Abrir detalhes.`
}

function buildProductSpeech(product) {
  const intro = `Descrição acessível de ${product.name}. Preço: ${formatCurrency(product.price)}.`
  const description = product.voiceDescription ?? buildFallbackProductSpeech(product)

  return `${intro} ${description}`
}

function buildFallbackProductSpeech(product) {
  const ingredients = product.tags.join(', ')
  const category = categories.find((item) => item.id === product.category)?.label ?? 'item'

  return [
    `Este item da categoria ${category.toLowerCase()} foi cadastrado pelo restaurante com os ingredientes: ${ingredients}.`,
    `A descrição do cardápio informa: ${product.description}.`,
    'Ao imaginar o prato, pense primeiro na base, depois no recheio principal, nos acompanhamentos e por fim no molho ou acabamento que dá aroma e umidade.',
  ].join(' ')
}

function prepareSpeechText(text) {
  return text
    .replace(/\bbacon\b/gi, 'beicon')
    .replace(/(\d+)\s*g\b/gi, '$1 gramas')
    .replace(/(\d+)\s*ml\b/gi, '$1 mililitros')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default App
