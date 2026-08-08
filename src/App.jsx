import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BadgePlus,
  BarChart3,
  CarFront,
  CircleCheck,
  Clipboard,
  CupSoda,
  CreditCard,
  ExternalLink,
  Flame,
  Hamburger,
  Leaf,
  Mic,
  MicOff,
  Minus,
  Nfc,
  Pencil,
  Pizza,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  Search,
  Sandwich,
  Settings,
  ShoppingCart,
  Table2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import heroBurger from './assets/hero-burger-fries.png'
import cheddarBacon from './assets/burger-cheddar-bacon.png'
import classicCheddar from './assets/burger-classic-cheddar.png'
import frangoCrocante from './assets/burger-frango-crocante.png'
import veggieFresh from './assets/burger-veggie-fresh.png'
import sandwichFrango from './assets/sandwich-frango.png'
import pizzaCalabresa from './assets/pizza-calabresa.png'
import bebidaCola from './assets/bebida-cola.png'
import vezzLogo from './assets/vezz-logo.svg'

const categories = [
  { id: 'hamburgueres', label: 'Hambúrgueres', shortLabel: 'Hambúrguer', icon: Hamburger },
  { id: 'sanduiches', label: 'Sanduíches', shortLabel: 'Sanduíches', icon: Sandwich },
  { id: 'pizzas', label: 'Pizzas', shortLabel: 'Pizzas', icon: Pizza },
  { id: 'bebidas', label: 'Bebidas', shortLabel: 'Bebidas', icon: CupSoda },
]

const fallbackImages = {
  hamburgueres: classicCheddar,
  sanduiches: sandwichFrango,
  pizzas: pizzaCalabresa,
  bebidas: bebidaCola,
}

const tableOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const restaurantId = 'food99like-demo'
const restaurantName = 'FOOD99LIKE'
const analyticsStorageKey = 'food99like-events'
const sessionStorageKey = 'food99like-session'
const cardBaseUrl = 'https://menu.food99like.app/c/8Ks29'
const partnerLinks = {
  vezz: 'https://vezzapp.com.br/',
  instagram: 'https://www.instagram.com/',
  whatsapp: 'https://wa.me/5581999999999',
}

const baseProducts = [
  {
    id: 'cheddar-bacon',
    category: 'hamburgueres',
    name: 'Cheddar com Bacon',
    price: 42,
    image: cheddarBacon,
    badge: 'Mais pedido',
    badgeTone: 'border-orange-200 bg-white text-orange-500',
    badgeIcon: Flame,
    badgeIconTone: 'fill-orange-500 text-orange-500',
    description:
      'Pão brioche selado, hambúrguer 150g, cheddar cremoso, bacon crocante, alface, tomate e molho da casa.',
    tags: ['Pão brioche', 'Carne 150g', 'Cheddar', 'Bacon', 'Alface', 'Tomate'],
  },
  {
    id: 'classico-cheddar',
    category: 'hamburgueres',
    name: 'Clássico Cheddar',
    price: 38,
    image: classicCheddar,
    badge: 'Sem pimenta',
    badgeTone: 'border-lime-200 bg-white text-lime-600',
    badgeIcon: Leaf,
    badgeIconTone: 'fill-lime-600 text-lime-600',
    description:
      'Hambúrguer clássico com pão brioche, carne 150g, cheddar, salada fresca e molho suave.',
    tags: ['Pão brioche', 'Carne 150g', 'Cheddar', 'Alface', 'Tomate', 'Cebola'],
  },
  {
    id: 'frango-crocante',
    category: 'hamburgueres',
    name: 'Frango Crocante',
    price: 36,
    image: frangoCrocante,
    badge: 'Mais pedido',
    badgeTone: 'border-orange-200 bg-white text-orange-500',
    badgeIcon: Flame,
    badgeIconTone: 'fill-orange-500 text-orange-500',
    description:
      'Filé de frango empanado, queijo, alface, tomate e maionese cremosa no pão brioche.',
    tags: ['Pão brioche', 'Frango crocante', 'Alface', 'Tomate', 'Maionese'],
  },
  {
    id: 'vegetariano-fresco',
    category: 'hamburgueres',
    name: 'Vegetariano Fresco',
    price: 34,
    image: veggieFresh,
    badge: 'Vegetariano',
    badgeTone: 'border-lime-200 bg-white text-lime-600',
    badgeIcon: Leaf,
    badgeIconTone: 'fill-lime-600 text-lime-600',
    description:
      'Pão integral com hambúrguer vegetal, folhas frescas, tomate, cebola roxa e molho verde.',
    tags: ['Pão integral', 'Hambúrguer vegetal', 'Alface', 'Tomate', 'Cebola roxa'],
  },
  {
    id: 'sanduiche-frango',
    category: 'sanduiches',
    name: 'Sanduíche de Frango',
    price: 29,
    image: sandwichFrango,
    badge: 'Novo',
    badgeTone: 'border-sky-200 bg-white text-sky-600',
    badgeIcon: BadgePlus,
    badgeIconTone: 'text-sky-600',
    description:
      'Pão tostado, frango grelhado, queijo, bacon, alface, tomate e molho especial.',
    tags: ['Frango', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
  },
  {
    id: 'sanduiche-club',
    category: 'sanduiches',
    name: 'Sanduíche da Casa',
    price: 32,
    image: sandwichFrango,
    badge: 'Recomendado',
    badgeTone: 'border-orange-200 bg-white text-orange-500',
    badgeIcon: Flame,
    badgeIconTone: 'fill-orange-500 text-orange-500',
    description:
      'Sanduíche generoso com frango, bacon, queijo, salada crocante e maionese da casa.',
    tags: ['Pão tostado', 'Frango', 'Bacon', 'Queijo', 'Salada'],
  },
  {
    id: 'pizza-calabresa',
    category: 'pizzas',
    name: 'Pizza de Calabresa',
    price: 49,
    image: pizzaCalabresa,
    badge: 'Forno',
    badgeTone: 'border-orange-200 bg-white text-orange-500',
    badgeIcon: Flame,
    badgeIconTone: 'fill-orange-500 text-orange-500',
    description:
      'Massa artesanal, molho de tomate, muçarela derretida, calabresa e cebola.',
    tags: ['Massa artesanal', 'Muçarela', 'Calabresa', 'Cebola'],
  },
  {
    id: 'pizza-marguerita',
    category: 'pizzas',
    name: 'Pizza Marguerita',
    price: 46,
    image: pizzaCalabresa,
    badge: 'Sem pimenta',
    badgeTone: 'border-lime-200 bg-white text-lime-600',
    badgeIcon: Leaf,
    badgeIconTone: 'fill-lime-600 text-lime-600',
    description:
      'Massa artesanal com muçarela, molho de tomate, tomate fresco e manjericão.',
    tags: ['Massa artesanal', 'Muçarela', 'Tomate', 'Manjericão'],
  },
  {
    id: 'refrigerante-cola',
    category: 'bebidas',
    name: 'Refrigerante Cola',
    price: 9,
    image: bebidaCola,
    badge: 'Gelado',
    badgeTone: 'border-sky-200 bg-white text-sky-600',
    badgeIcon: CupSoda,
    badgeIconTone: 'text-sky-600',
    description: 'Copo de refrigerante cola com gelo, limão e canudo.',
    tags: ['500 ml', 'Com gelo', 'Limão'],
  },
  {
    id: 'cha-gelado-limao',
    category: 'bebidas',
    name: 'Chá Gelado de Limão',
    price: 11,
    image: bebidaCola,
    badge: 'Gelado',
    badgeTone: 'border-sky-200 bg-white text-sky-600',
    badgeIcon: CupSoda,
    badgeIconTone: 'text-sky-600',
    description: 'Bebida gelada de limão servida com bastante gelo.',
    tags: ['500 ml', 'Refrescante', 'Limão'],
  },
]

function App() {
  const initialTable = getTableFromUrl()
  const [analyticsSession] = useState(() => getAnalyticsSession(initialTable))
  const [screen, setScreen] = useState(() => getInitialScreen())
  const [activeCategory, setActiveCategory] = useState('hamburgueres')
  const [selectedProductId, setSelectedProductId] = useState(() => getProductFromHash())
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
  const speechStopTimerRef = useRef(null)
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
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
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

  function showScreen(nextScreen, hashValue = nextScreen) {
    stopSpeech()
    setScreen(nextScreen)
    window.location.hash = hashValue
  }

  function openProduct(product) {
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

  function addToCart(productId, quantity = 1, note = '') {
    const product = products.find((item) => item.id === productId)

    setCart((items) => {
      const existing = items.find((item) => item.productId === productId && item.note === note)

      if (existing) {
        return items.map((item) =>
          item.productId === productId && item.note === note
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...items, { productId, quantity, note }]
    })

    setReaderStatus(`${product?.name ?? 'Item'} adicionado ao pedido.`)
    trackEvent('product_add', {
      productId,
      productName: product?.name ?? '',
      quantity,
      hasNote: Boolean(note),
    })
  }

  function updateCartItem(productId, quantity) {
    setCart((items) =>
      items
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function addAdminItem(item) {
    setProducts((items) => [...items, { ...item, active: true }])
    setActiveCategory(item.category)
    trackEvent('admin_item_created', {
      productId: item.id,
      productName: item.name,
      category: item.category,
    })
    showScreen('menu')
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
    setSearchQuery('')
    trackEvent('category_view', { category: categoryId })
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
      speakText('Leitor automático ativado. Ao abrir um item, vou falar os ingredientes.')
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
    setOrderSent(true)
    setReaderStatus(`Pedido enviado para a mesa ${tableNumber || 'selecionada'}.`)
    trackEvent('order_sent', {
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
      aria-label="Cardápio digital FOOD99LIKE"
      className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-950 md:grid md:place-items-center md:px-6 md:py-8"
    >
      <div
        className={`fixed inset-0 h-[100dvh] w-[100dvw] max-w-none overflow-hidden md:static md:mx-auto md:h-[932px] md:w-full md:max-w-[430px] md:rounded-[28px] md:shadow-2xl md:shadow-slate-300/80 ${
          screen === 'menu' || screen === 'produto' ? 'bg-[#030407]' : 'bg-white'
        }`}
      >
        {screen === 'menu' && (
          <MenuScreen
            products={menuProducts}
            activeCategory={activeCategory}
            cartQuantity={cartQuantity}
            cartTotal={cartTotal}
            searchQuery={searchQuery}
            tableNumber={tableNumber}
            onCategoryChange={changeCategory}
            onSearchChange={changeSearchQuery}
            onOpenSettings={() => showScreen('configuracoes')}
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

        {screen === 'produto' && (
          <ProductScreen
            product={selectedProduct}
            onBack={() => showScreen('menu')}
            onAddToCart={addToCart}
            onOrderNow={() => showScreen('pedido')}
            onReadProduct={readProductIngredients}
          />
        )}

        {screen === 'configuracoes' && (
          <SettingsScreen
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
            onToggleProductActive={toggleProductActive}
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

function MenuScreen({
  products,
  activeCategory,
  cartQuantity,
  cartTotal,
  searchQuery,
  tableNumber,
  onCategoryChange,
  onSearchChange,
  onOpenSettings,
  onOpenProduct,
  onAddToCart,
  onOpenOrder,
  onOpenVezz,
  onStartVoiceCommand,
  onToggleVoiceReader,
  voiceCommandListening,
  voiceReaderEnabled,
}) {
  const categoryProducts = filterProducts(
    products.filter((product) => product.category === activeCategory),
    searchQuery,
  )
  const featuredProduct = products.find((product) => product.badge === 'Mais pedido') ?? products[0]
  const activeCategoryLabel =
    categories.find((category) => category.id === activeCategory)?.label ?? 'Cardápio'

  return (
    <section
      className="relative h-full overflow-y-auto bg-[#030407] pb-28 text-white"
      aria-labelledby="menu-title"
    >
      <HeroCarousel
        featuredProduct={featuredProduct}
        tableNumber={tableNumber}
        onOpenProduct={onOpenProduct}
        voiceReaderEnabled={voiceReaderEnabled}
        onOpenSettings={onOpenSettings}
        onOpenVezz={onOpenVezz}
        onToggleVoiceReader={onToggleVoiceReader}
      />

      <div className="mt-[13px] flex items-center gap-2 overflow-hidden px-[18px] pb-1">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            aria-pressed={category.id === activeCategory}
            aria-label={`Mostrar categoria ${category.label}`}
            className={`flex h-[36px] w-[88px] shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-[9px] font-bold shadow-sm transition active:scale-[0.98] ${
              category.id === activeCategory
                ? 'bg-[#ffd51a] text-slate-950'
                : 'bg-[#191c25] text-slate-200 ring-1 ring-white/10'
            }`}
          >
            <category.icon size={15} strokeWidth={2.4} />
            {category.shortLabel}
          </button>
        ))}
      </div>

      <h1
        id="menu-title"
        data-screen-title="true"
        tabIndex={-1}
        className="mt-[17px] px-[18px] text-[19px] font-black leading-none text-white outline-none"
      >
        {activeCategoryLabel} ({categoryProducts.length})
      </h1>

      <div
        className="mx-[18px] mt-4 grid grid-cols-[1fr_auto] gap-2 rounded-xl bg-[#11141c] p-2 ring-1 ring-white/10"
      >
        <label className="grid grid-cols-[auto_1fr] items-center gap-2">
          <Search size={17} className="text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar item ou ingrediente"
            className="h-10 w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="button"
          onClick={onStartVoiceCommand}
          aria-label="Falar comando de voz"
          aria-pressed={voiceCommandListening}
          className={`grid size-10 place-items-center rounded-lg transition active:scale-95 ${
            voiceCommandListening
              ? 'bg-[#ffda16] text-slate-950'
              : 'bg-white/10 text-white ring-1 ring-white/10'
          }`}
        >
          {voiceCommandListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      </div>

      <div className="mx-3 mt-4 w-[406px] max-w-[calc(100vw-24px)] rounded-sm bg-[#090a0f] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10">
        {categoryProducts.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {categoryProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                index={index}
                product={product}
                onAdd={() => onAddToCart(product.id)}
                onOpen={() => onOpenProduct(product)}
              />
            ))}
          </div>
        ) : (
          <p
            className="p-4 text-center text-sm font-bold text-slate-300"
          >
            Nenhum item encontrado.
          </p>
        )}
      </div>

      {cartQuantity > 0 && (
        <CartBar quantity={cartQuantity} total={cartTotal} onOpenOrder={onOpenOrder} />
      )}

    </section>
  )
}

function HeroCarousel({
  featuredProduct,
  tableNumber,
  onOpenProduct,
  voiceReaderEnabled,
  onOpenSettings,
  onOpenVezz,
  onToggleVoiceReader,
}) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return undefined

    const timerId = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % 2)
    }, 14000)

    return () => window.clearInterval(timerId)
  }, [isPaused])

  function selectSlide(slide) {
    setActiveSlide(slide)
    setIsPaused(true)
  }

  return (
    <div
      className="relative ml-2 mt-2 h-[168px] w-[414px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[18px] bg-slate-900"
      onBlurCapture={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          activeSlide === 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={activeSlide !== 0}
      >
        <img
          src={heroBurger}
          alt="Hamburguer artesanal com bacon e batata frita"
          className="h-full w-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/5" />
        {featuredProduct && (
          <button
            type="button"
            onClick={() => onOpenProduct(featuredProduct)}
            tabIndex={activeSlide === 0 ? 0 : -1}
            className="absolute bottom-3 left-3 max-w-[258px] rounded-lg bg-black/70 px-3 py-2 text-left shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur-sm transition active:scale-[0.98]"
          >
            <span className="block text-[9px] font-black uppercase tracking-[0.08em] text-[#ffd51a]">
              Destaque da casa{tableNumber ? ` - Mesa ${tableNumber}` : ''}
            </span>
            <span className="mt-1 block truncate text-[15px] font-black leading-none text-white">
              {featuredProduct.name}
            </span>
            <span className="mt-1 block text-[11px] font-black text-white/75">
              {formatCurrency(featuredProduct.price)}
            </span>
          </button>
        )}
      </div>

      <div
        className={`absolute inset-0 bg-[#2bb8cb] transition-opacity duration-700 ${
          activeSlide === 1 ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={activeSlide !== 1}
      >
        <div className="absolute inset-y-0 right-0 w-40 bg-white/12" />
        <div className="relative z-10 flex h-full flex-col justify-center px-7 pt-5">
          <img
            src={vezzLogo}
            alt="Vezz"
            className="h-14 w-[250px] object-contain object-left"
            draggable="false"
          />
          <p className="mt-2 max-w-[230px] text-[20px] font-black leading-[1.05] text-slate-950">
            Vai embora? Vá com a Vezz.
          </p>
          <button
            type="button"
            onClick={onOpenVezz}
            tabIndex={activeSlide === 1 ? 0 : -1}
            className="mt-3 inline-flex h-9 w-fit items-center gap-2 rounded-lg bg-slate-950 px-4 text-[11px] font-black text-white shadow-lg shadow-cyan-900/25 transition active:scale-[0.98]"
          >
            <CarFront size={15} />
            CHAMAR VEZZ
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleVoiceReader}
        aria-label={
          voiceReaderEnabled
            ? 'Desativar leitor automatico de ingredientes'
            : 'Ativar leitor automatico de ingredientes'
        }
        aria-pressed={voiceReaderEnabled}
        title={voiceReaderEnabled ? 'Desativar leitor automatico' : 'Ativar leitor automatico'}
        className={`absolute left-3 top-3 z-20 grid size-[38px] place-items-center rounded-full shadow-lg shadow-black/20 transition active:scale-95 ${
          voiceReaderEnabled ? 'bg-[#ffda16] text-slate-950' : 'bg-white text-slate-900'
        }`}
      >
        {voiceReaderEnabled ? (
          <Volume2 size={19} strokeWidth={2.7} />
        ) : (
          <VolumeX size={19} strokeWidth={2.7} />
        )}
      </button>

      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Configuracoes"
        className="absolute right-3 top-3 z-20 grid size-[38px] place-items-center rounded-full bg-white text-slate-900 shadow-lg shadow-black/20 transition active:scale-95"
      >
        <Settings size={19} strokeWidth={2.6} />
      </button>

      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
        {[0, 1].map((slide) => (
          <button
            type="button"
            key={slide}
            onClick={() => selectSlide(slide)}
            aria-label={slide === 0 ? 'Mostrar foto do hamburguer' : 'Mostrar chamada da Vezz'}
            aria-pressed={activeSlide === slide}
            className={`h-2.5 rounded-full transition-all ${
              activeSlide === slide ? 'w-6 bg-white' : 'w-2.5 bg-white/45'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, index, onAdd, onOpen }) {
  const productNumber = getMenuProductNumber(product, index)

  return (
    <article className="relative min-h-[218px] text-white">
      <button
        type="button"
        onClick={onOpen}
        aria-label={buildProductAriaLabel(product)}
        className="block h-full w-full pb-8 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#ffd51a]"
      >
        <div className="relative flex h-[92px] items-center justify-center overflow-hidden bg-[#171a22]">
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="h-[96px] w-full scale-[1.08] object-contain"
            draggable="false"
          />
        </div>

        <div className="mt-2">
          <p className="text-[9px] font-black uppercase tracking-[0.04em] text-[#ffd51a]">
            {productNumber}. {product.badge}
          </p>
          <h3 className="mt-1 text-[13px] font-black leading-[1.08] text-white">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-4 text-[9.5px] font-semibold leading-[1.28] text-white/60">
            {product.description}
          </p>
          <p className="mt-2 text-[13px] font-black text-white">
            {formatCurrency(product.price)}
          </p>
        </div>
      </button>

      <button
        type="button"
        aria-label={`Adicionar ${product.name}`}
        onClick={(event) => {
          event.stopPropagation()
          onAdd()
        }}
        className="absolute bottom-0 right-0 z-20 grid size-7 place-items-center rounded-sm bg-[#ffd51a] text-slate-950 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </article>
  )
}

function ProductScreen({ product, onBack, onAddToCart, onOrderNow, onReadProduct }) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const BadgeIcon = product.badgeIcon

  function addCurrentItem() {
    onAddToCart(product.id, quantity, note.trim())
  }

  return (
    <section className="h-full overflow-y-auto overflow-x-hidden bg-[#030407] pb-8 text-white" aria-labelledby="product-title">
      <div className="relative min-h-[314px] bg-[#090a0f] px-5 pb-5 pt-4 ring-1 ring-white/10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white shadow-lg shadow-black/25 ring-1 ring-white/10 transition active:scale-95"
        >
          <ArrowLeft size={21} strokeWidth={2.7} />
        </button>

        <button
          type="button"
          onClick={() => onReadProduct(product)}
          aria-label={`Ouvir ingredientes de ${product.name}`}
          title="Ouvir ingredientes"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-[#ffd51a] text-slate-950 shadow-lg shadow-black/25 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
        >
          <Volume2 size={19} strokeWidth={2.7} />
        </button>

        <div className="mx-auto flex h-[278px] w-full max-w-[350px] items-end justify-center overflow-hidden pt-8">
          <img
            src={product.image}
            alt={product.name}
            className="h-[230px] w-full max-w-[270px] object-contain"
            draggable="false"
          />
        </div>
      </div>

      <div className="ml-5 w-[390px] max-w-[calc(100vw-40px)] overflow-x-hidden pt-5">
        <span
          className={`inline-flex h-[24px] items-center gap-1 rounded-full border px-3 text-[10px] font-black ${product.badgeTone}`}
        >
          <BadgeIcon size={12} strokeWidth={2.5} className={product.badgeIconTone} />
          {product.badge}
        </span>

        <div className="mt-3">
          <h1
            id="product-title"
            data-screen-title="true"
            tabIndex={-1}
            className="text-[26px] font-black leading-tight text-white outline-none"
          >
            {product.name}
          </h1>
          <p className="mt-1 text-[20px] font-black text-white">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/60">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex max-w-full flex-wrap gap-2" aria-label="Ingredientes principais">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-bold text-white/70 ring-1 ring-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-[#11141c] p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-white">Quantidade</p>
            <div className="flex items-center gap-3">
              <StepperButton
                icon={Minus}
                label={`Diminuir quantidade de ${product.name}`}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              />
              <span className="w-7 text-center text-lg font-black text-white">{quantity}</span>
              <StepperButton
                icon={Plus}
                label={`Aumentar quantidade de ${product.name}`}
                onClick={() => setQuantity(quantity + 1)}
              />
            </div>
          </div>

          <label className="mt-4 block text-sm font-black text-white">
            Observação
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex.: sem cebola, molho separado..."
              className="mt-2 h-20 w-full resize-none rounded-lg bg-[#090a0f] px-3 py-3 text-sm font-semibold text-white outline-none ring-1 ring-white/10 placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={addCurrentItem}
            className="h-14 rounded-lg bg-white/10 text-sm font-black text-white ring-1 ring-white/10 transition active:scale-[0.99]"
          >
            ADICIONAR
          </button>
          <button
            type="button"
            onClick={() => {
              addCurrentItem()
              onOrderNow()
            }}
            className="h-14 rounded-lg bg-[#ffda16] text-sm font-black text-black transition active:scale-[0.99]"
          >
            FAZER PEDIDO
          </button>
        </div>
      </div>
    </section>
  )
}

function SettingsScreen({
  analyticsSummary,
  categories,
  copied,
  generatedNfcLink,
  nfcTable,
  products,
  onAddAdminItem,
  onBack,
  onCopyNfcLink,
  onNfcTableChange,
  onOpenNfcPreview,
  onOpenPartnerLink,
  onToggleProductActive,
  onUpdateProduct,
}) {
  const [activeTab, setActiveTab] = useState(() => getInitialAdminTab())
  const [editingProductId, setEditingProductId] = useState('')
  const [form, setForm] = useState({
    name: '',
    category: 'hamburgueres',
    price: '',
    description: '',
    ingredients: '',
  })

  function submitItem(event) {
    event.preventDefault()

    const price = Number(String(form.price).replace(',', '.'))
    const ingredients = form.ingredients
      .split(',')
      .map((ingredient) => ingredient.trim())
      .filter(Boolean)

    if (!form.name.trim() || !price) {
      return
    }

    const currentProduct = products.find((product) => product.id === editingProductId)
    const productPayload = {
      ...(currentProduct ?? {}),
      id: currentProduct?.id ?? `admin-${Date.now()}`,
      category: form.category,
      name: form.name.trim(),
      price,
      image: currentProduct?.image ?? fallbackImages[form.category],
      badge: currentProduct?.badge ?? 'Admin',
      badgeTone: currentProduct?.badgeTone ?? 'border-slate-200 bg-white text-slate-600',
      badgeIcon: currentProduct?.badgeIcon ?? Save,
      badgeIconTone: currentProduct?.badgeIconTone ?? 'text-slate-600',
      description: form.description.trim() || 'Item cadastrado pelo administrador do cardápio.',
      tags: ingredients.length ? ingredients : ['Cadastro admin', 'Disponível', 'Novo item'],
      active: currentProduct?.active !== false,
    }

    if (currentProduct) {
      onUpdateProduct(productPayload)
    } else {
      onAddAdminItem(productPayload)
    }

    setEditingProductId('')
    setForm({
      name: '',
      category: 'hamburgueres',
      price: '',
      description: '',
      ingredients: '',
    })
  }

  const settingsTabs = [
    { id: 'cardapio', label: 'Cardápio', icon: BadgePlus },
    { id: 'mesas', label: 'Mesas', icon: Nfc },
    { id: 'vezz', label: 'Vezz', icon: BarChart3 },
    { id: 'cartao', label: 'Cartão', icon: CreditCard },
  ]

  function editProduct(product) {
    setEditingProductId(product.id)
    setActiveTab('cardapio')
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price).replace('.', ','),
      description: product.description,
      ingredients: product.tags.join(', '),
    })
  }

  function cancelEdit() {
    setEditingProductId('')
    setForm({
      name: '',
      category: 'hamburgueres',
      price: '',
      description: '',
      ingredients: '',
    })
  }

  return (
    <section className="h-full overflow-y-auto overflow-x-hidden bg-white pb-8">
      <HeaderBar title="Admin" onBack={onBack} />

      <div className="ml-5 w-[390px] max-w-[calc(100vw-40px)] pt-5">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-[11px] font-black uppercase text-slate-400">Configurações</p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950">
            Gerenciar cardápio
          </h2>
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
          <form onSubmit={submitItem} className="mt-5 space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">
                    {editingProductId ? 'Editar item' : 'Novo item'}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {editingProductId ? 'Atualize preço, ingredientes e descrição.' : 'Cadastro rápido para o menu.'}
                  </p>
                </div>
                <Save size={19} className="text-slate-400" />
              </div>

              <div className="mt-4 space-y-3">
                <AdminInput
                  label="Nome"
                  value={form.name}
                  placeholder="Ex.: Combo da Casa"
                  onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                />

                <div className="grid grid-cols-[1fr_104px] gap-3">
                  <label className="block text-xs font-black text-slate-600">
                    Categoria
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, category: event.target.value }))
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
                    label="Preço"
                    value={form.price}
                    placeholder="39,90"
                    onChange={(value) => setForm((current) => ({ ...current, price: value }))}
                  />
                </div>

                <AdminInput
                  label="Ingredientes"
                  value={form.ingredients}
                  placeholder="Pão, carne 150g, queijo"
                  onChange={(value) =>
                    setForm((current) => ({ ...current, ingredients: value }))
                  }
                />

                <AdminInput
                  label="Descrição"
                  value={form.description}
                  placeholder="Resumo do item"
                  onChange={(value) =>
                    setForm((current) => ({ ...current, description: value }))
                  }
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-black text-white transition active:scale-[0.99]"
              >
                <Save size={17} />
                {editingProductId ? 'ATUALIZAR ITEM' : 'SALVAR ITEM'}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="mt-2 h-10 w-full rounded-lg bg-white text-sm font-black text-slate-700 ring-1 ring-slate-200 transition active:scale-[0.99]"
                >
                  CANCELAR EDIÇÃO
                </button>
              )}
            </section>

            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <h2 className="text-base font-black text-slate-950">Produtos</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Edite sem perder histórico.
                  </p>
                </div>
                <span className="text-sm font-black text-slate-400">{products.length}</span>
              </div>

              <div className="divide-y divide-slate-100">
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-[1fr_auto] gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="min-w-0 text-left"
                    >
                      <span className="block truncate text-sm font-black text-slate-950">
                        {product.name}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-slate-500">
                        {formatCurrency(product.price)} ·{' '}
                        {categories.find((category) => category.id === product.category)?.label}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                        aria-label={`Editar ${product.name}`}
                        className="grid size-9 place-items-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleProductActive(product.id)}
                        aria-label={
                          product.active === false
                            ? `Ativar ${product.name}`
                            : `Desativar ${product.name}`
                        }
                        className={`h-9 rounded-lg px-3 text-xs font-black ring-1 ${
                          product.active === false
                            ? 'bg-slate-50 text-slate-500 ring-slate-200'
                            : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                        }`}
                      >
                        {product.active === false ? 'INATIVO' : 'ATIVO'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </form>
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
                <PartnerMetric label="Ticket medio" value={formatCurrency(analyticsSummary.averageTicket)} />
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
                  <p className="pt-2 text-sm tracking-[0.18em] text-slate-950">⠉⠁⠗⠙⠁⠏⠊⠕</p>
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
  const [paymentType, setPaymentType] = useState('caixa')

  return (
    <section className="h-full overflow-y-auto overflow-x-hidden bg-white pb-8">
      <HeaderBar title="Finalizar pedido" onBack={onBack} />

      <div className="ml-5 w-[390px] max-w-[calc(100vw-40px)] space-y-4 pt-5">
        {orderSent ? (
          <section className="rounded-[22px] bg-emerald-50 p-5 text-center ring-1 ring-emerald-100">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500 text-white">
              <CircleCheck size={28} />
            </div>
            <h1 className="mt-4 text-xl font-black text-slate-900">Pedido enviado</h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Seu pedido foi registrado para a mesa {tableNumber || 'selecionada'}.
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-[18px] bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Table2 size={18} className="text-orange-500" />
                <h2 className="text-base font-black text-slate-900">Mesa</h2>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {tableOptions.map((table) => (
                  <button
                    type="button"
                    key={table}
                    onClick={() => onTableChange(table)}
                    aria-pressed={tableNumber === table}
                    aria-label={`Selecionar mesa ${table}`}
                    className={`h-10 rounded-[12px] text-sm font-black transition active:scale-[0.98] ${
                      tableNumber === table
                        ? 'bg-[#ffda16] text-black'
                        : 'bg-white text-slate-700 ring-1 ring-slate-100'
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-xs font-black text-slate-600">
                Nome
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Opcional"
                  className="mt-2 h-11 w-full rounded-[12px] bg-white px-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-100 placeholder:text-slate-400"
                />
              </label>
            </section>

            <section className="rounded-[18px] bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ReceiptText size={18} className="text-orange-500" />
                <h2 className="text-base font-black text-slate-900">Pedido</h2>
              </div>

              <div className="mt-4 space-y-3">
                {cartItems.length === 0 ? (
                  <p className="rounded-[14px] bg-white p-4 text-sm font-bold text-slate-500">
                    Nenhum item adicionado.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.note}`}
                      className="flex gap-3 rounded-[14px] bg-white p-3 ring-1 ring-slate-100"
                    >
                      <img
                        src={item.product.image}
                        alt=""
                        aria-hidden="true"
                        className="size-16 rounded-[12px] object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-900">{item.product.name}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {formatCurrency(item.product.price)}
                        </p>
                        {item.note && (
                          <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-400">
                            {item.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StepperButton
                          icon={Minus}
                          label={`Diminuir quantidade de ${item.product.name}`}
                          onClick={() => onUpdateCartItem(item.productId, item.quantity - 1)}
                        />
                        <span className="w-5 text-center text-sm font-black">{item.quantity}</span>
                        <StepperButton
                          icon={Plus}
                          label={`Aumentar quantidade de ${item.product.name}`}
                          onClick={() => onUpdateCartItem(item.productId, item.quantity + 1)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[18px] bg-slate-50 p-4">
              <OptionGroup
                label="Entrega"
                value={serviceType}
                options={[
                  ['mesa', 'Na mesa'],
                  ['balcao', 'Retirar no balcão'],
                ]}
                onChange={setServiceType}
              />

              <div className="mt-4">
                <OptionGroup
                  label="Pagamento"
                  value={paymentType}
                  options={[
                    ['caixa', 'Pagar no caixa'],
                    ['maquininha', 'Maquininha'],
                  ]}
                  onChange={setPaymentType}
                />
              </div>
            </section>

            <div className="rounded-[18px] bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white/60">Total</p>
                <p className="text-2xl font-black">{formatCurrency(cartTotal)}</p>
              </div>
              <button
                type="button"
                onClick={() => onSendOrder({ customerName, serviceType, paymentType })}
                disabled={!cartItems.length || !tableNumber}
                className="mt-4 h-14 w-full rounded-[14px] bg-[#ffda16] text-sm font-black text-black transition active:scale-[0.99] disabled:bg-white/15 disabled:text-white/35"
              >
                ENVIAR PEDIDO
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function CartBar({ quantity, total, onOpenOrder }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 rounded-[18px] bg-slate-950 p-3 text-white shadow-2xl shadow-slate-400/60">
      <button
        type="button"
        onClick={onOpenOrder}
        aria-label={`Fazer pedido com ${quantity} ${quantity === 1 ? 'item' : 'itens'}, total de ${formatCurrency(total)}`}
        className="flex h-12 w-full items-center justify-between gap-3"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-white/10">
            <ShoppingCart size={18} />
          </span>
          <span className="text-left">
            <span className="block text-sm font-black">Fazer pedido</span>
            <span className="block text-[10px] font-bold text-white/55">
              {quantity} {quantity === 1 ? 'item' : 'itens'}
            </span>
          </span>
        </span>
        <span className="text-base font-black">{formatCurrency(total)}</span>
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

function StepperButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full bg-white text-slate-900 shadow-sm ring-1 ring-slate-100 transition active:scale-95"
    >
      <Icon size={16} strokeWidth={3} />
    </button>
  )
}

function OptionGroup({ label, value, options, onChange }) {
  return (
    <div>
      <p className="text-xs font-black text-slate-600">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map(([id, optionLabel]) => (
          <button
            type="button"
            key={id}
            onClick={() => onChange(id)}
            aria-pressed={value === id}
            className={`h-11 rounded-[12px] text-xs font-black transition active:scale-[0.98] ${
              value === id
                ? 'bg-[#ffda16] text-black'
                : 'bg-white text-slate-700 ring-1 ring-slate-100'
            }`}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
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

function getMenuProductNumber(product, index) {
  const categoryBase = {
    hamburgueres: 100,
    sanduiches: 200,
    pizzas: 300,
    bebidas: 400,
  }

  return (categoryBase[product.category] ?? 900) + index + 1
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
  if (hash === '#pedido') return 'pedido'
  if (hash.startsWith('#configuracoes')) return 'configuracoes'

  return 'menu'
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
  return `${product.name}. Ingredientes principais: ${product.tags.join(', ')}. ${product.description}`
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
