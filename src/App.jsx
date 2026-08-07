import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BadgePlus,
  CircleCheck,
  Clipboard,
  CupSoda,
  Flame,
  Hamburger,
  Leaf,
  Minus,
  Moon,
  Nfc,
  Pizza,
  Plus,
  QrCode,
  ReceiptText,
  Save,
  Sandwich,
  Settings,
  ShoppingCart,
  Sun,
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
  const [screen, setScreen] = useState(() => getInitialScreen())
  const [activeCategory, setActiveCategory] = useState('hamburgueres')
  const [selectedProductId, setSelectedProductId] = useState(() => getProductFromHash())
  const [cart, setCart] = useState([])
  const [tableNumber, setTableNumber] = useState(initialTable || '')
  const [nfcTable, setNfcTable] = useState(initialTable || '01')
  const [copied, setCopied] = useState(false)
  const [orderSent, setOrderSent] = useState(false)
  const [adminItems, setAdminItems] = useState([])
  const [voiceReaderEnabled, setVoiceReaderEnabled] = useState(false)
  const [readerStatus, setReaderStatus] = useState('')
  const [darkMenuEnabled, setDarkMenuEnabled] = useState(() => getInitialMenuTheme())

  const products = useMemo(() => [...baseProducts, ...adminItems], [adminItems])
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]
  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product)
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
  const generatedNfcLink = buildNfcUrl(nfcTable || tableNumber || '01')

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      document.querySelector('[data-screen-title="true"]')?.focus()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [screen, selectedProductId])

  useEffect(() => {
    return () => window.speechSynthesis?.cancel()
  }, [])

  function showScreen(nextScreen, hashValue = nextScreen) {
    setScreen(nextScreen)
    window.location.hash = hashValue
  }

  function openProduct(product) {
    setSelectedProductId(product.id)
    showScreen('produto', `produto=${product.id}`)

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
  }

  function updateCartItem(productId, quantity) {
    setCart((items) =>
      items
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function addAdminItem(item) {
    setAdminItems((items) => [...items, item])
    setActiveCategory(item.category)
    showScreen('menu')
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
    showScreen('menu')
  }

  function toggleVoiceReader() {
    const nextValue = !voiceReaderEnabled

    setVoiceReaderEnabled(nextValue)

    if (nextValue) {
      speakText('Leitor automático ativado. Ao abrir um item, vou falar os ingredientes.')
      return
    }

    window.speechSynthesis?.cancel()
    setReaderStatus('Leitor automático desativado.')
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

    window.speechSynthesis.cancel()

    const utterance = new window.SpeechSynthesisUtterance(prepareSpeechText(message))
    utterance.lang = 'pt-BR'
    utterance.rate = 0.92
    utterance.pitch = 1
    utterance.onerror = () => setReaderStatus('Não foi possível iniciar a leitura por voz.')

    window.speechSynthesis.speak(utterance)
  }

  function sendOrder() {
    setOrderSent(true)
    setReaderStatus(`Pedido enviado para a mesa ${tableNumber || 'selecionada'}.`)
  }

  function toggleDarkMenu() {
    setDarkMenuEnabled((enabled) => {
      const nextValue = !enabled
      saveMenuTheme(nextValue)
      return nextValue
    })
  }

  return (
    <main
      aria-label="Cardápio digital FOOD99LIKE"
      className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-950 md:grid md:place-items-center md:px-6 md:py-8"
    >
      <div className="fixed inset-0 h-[100dvh] w-[100dvw] max-w-none overflow-hidden bg-white md:static md:mx-auto md:h-[932px] md:w-full md:max-w-[430px] md:rounded-[28px] md:shadow-2xl md:shadow-slate-300/80">
        {screen === 'menu' && (
          <MenuScreen
            products={products}
            activeCategory={activeCategory}
            cartQuantity={cartQuantity}
            cartTotal={cartTotal}
            tableNumber={tableNumber}
            onCategoryChange={setActiveCategory}
            onOpenSettings={() => showScreen('configuracoes')}
            onOpenProduct={openProduct}
            onAddToCart={addToCart}
            onOpenOrder={() => showScreen('pedido')}
            onToggleVoiceReader={toggleVoiceReader}
            voiceReaderEnabled={voiceReaderEnabled}
            darkMode={darkMenuEnabled}
            onToggleDarkMode={toggleDarkMenu}
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
            generatedNfcLink={generatedNfcLink}
            onBack={() => showScreen('menu')}
            onAddAdminItem={addAdminItem}
            onCopyNfcLink={copyNfcLink}
            onNfcTableChange={setNfcTable}
            onOpenNfcPreview={openNfcPreview}
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
  tableNumber,
  onCategoryChange,
  onOpenSettings,
  onOpenProduct,
  onAddToCart,
  onOpenOrder,
  onToggleVoiceReader,
  voiceReaderEnabled,
  darkMode,
  onToggleDarkMode,
}) {
  const categoryProducts = products.filter((product) => product.category === activeCategory)
  const activeCategoryLabel =
    categories.find((category) => category.id === activeCategory)?.label ?? 'Cardápio'

  return (
    <section
      className={`relative h-full overflow-y-auto pb-28 transition-colors ${
        darkMode ? 'bg-slate-950' : 'bg-white'
      }`}
      aria-labelledby="menu-title"
    >
      <div className="relative ml-2 mt-2 h-[168px] w-[414px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[18px] bg-slate-900">
        <img
          src={heroBurger}
          alt="Hambúrguer artesanal com bacon e batata frita"
          className="h-full w-full object-cover"
          draggable="false"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/5" />

        <button
          type="button"
          onClick={onToggleVoiceReader}
          aria-label={
            voiceReaderEnabled
              ? 'Desativar leitor automático de ingredientes'
              : 'Ativar leitor automático de ingredientes'
          }
          aria-pressed={voiceReaderEnabled}
          title={
            voiceReaderEnabled
              ? 'Desativar leitor automático'
              : 'Ativar leitor automático'
          }
          className={`absolute left-3 top-3 grid size-[38px] place-items-center rounded-full shadow-lg shadow-black/20 transition active:scale-95 ${
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
          aria-label="Configurações"
          className="absolute right-3 top-3 grid size-[38px] place-items-center rounded-full bg-white text-slate-900 shadow-lg shadow-black/20 transition active:scale-95"
        >
          <Settings size={19} strokeWidth={2.6} />
        </button>

        {tableNumber && (
          <span className="absolute bottom-3 left-3 inline-flex h-8 items-center gap-2 rounded-full bg-white/95 px-3 text-xs font-black text-slate-900 shadow-lg shadow-black/20">
            <Table2 size={15} />
            Mesa {tableNumber}
          </span>
        )}
      </div>

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
                : darkMode
                  ? 'bg-slate-900 text-slate-200 ring-1 ring-white/10'
                  : 'bg-white text-slate-700 ring-1 ring-slate-100'
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
        className={`mt-[17px] px-[18px] text-[19px] font-black leading-none outline-none ${
          darkMode ? 'text-white' : 'text-slate-800'
        }`}
      >
        {activeCategoryLabel} ({categoryProducts.length})
      </h1>

      <div className="ml-4 mt-4 grid w-[398px] max-w-[calc(100vw-32px)] grid-cols-2 gap-[10px]">
        {categoryProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            darkMode={darkMode}
            onAdd={() => onAddToCart(product.id)}
            onOpen={() => onOpenProduct(product)}
          />
        ))}
      </div>

      {cartQuantity > 0 && (
        <CartBar quantity={cartQuantity} total={cartTotal} onOpenOrder={onOpenOrder} />
      )}

      <MenuThemeToggle
        darkMode={darkMode}
        hasCart={cartQuantity > 0}
        onToggle={onToggleDarkMode}
      />
    </section>
  )
}

function ProductCard({ product, darkMode, onAdd, onOpen }) {
  const BadgeIcon = product.badgeIcon

  return (
    <article
      className={`relative min-h-[248px] overflow-hidden rounded-[14px] shadow-[0_3px_20px_rgba(15,23,42,0.09)] ring-1 transition-colors ${
        darkMode ? 'bg-slate-900 ring-white/10' : 'bg-white ring-slate-100'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={buildProductAriaLabel(product)}
        className="block min-h-[248px] w-full p-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <span
          className={`absolute left-2 top-2 z-10 inline-flex h-[20px] items-center gap-1 rounded-full border px-2 text-[8px] font-black ${product.badgeTone}`}
        >
          <BadgeIcon size={10} strokeWidth={2.5} className={product.badgeIconTone} />
          {product.badge}
        </span>

        <div className="flex h-[126px] items-end justify-center overflow-hidden pt-3">
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="h-[116px] w-full scale-[1.2] object-contain"
            draggable="false"
          />
        </div>

        <div className="mt-2 pr-5">
          <h3
            className={`text-[15px] font-black leading-[1.1] ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`mt-1 text-[14px] font-black leading-none ${
              darkMode ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="mt-3 flex max-w-[142px] flex-wrap gap-1" aria-hidden="true">
          {product.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className={`rounded-md px-[7px] py-[5px] text-[7px] font-bold leading-none ${
                darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      <button
        type="button"
        aria-label={`Adicionar ${product.name}`}
        onClick={(event) => {
          event.stopPropagation()
          onAdd()
        }}
        className="absolute bottom-3 right-3 z-20 grid size-[24px] place-items-center rounded-full bg-[#ffc10e] text-white shadow-md shadow-yellow-300/50 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Plus size={18} strokeWidth={3} />
      </button>
    </article>
  )
}

function MenuThemeToggle({ darkMode, hasCart, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={darkMode ? 'Ativar modo claro do cardápio' : 'Ativar modo noturno do cardápio'}
      aria-pressed={darkMode}
      title={darkMode ? 'Modo claro' : 'Modo noturno'}
      className={`fixed right-4 z-30 grid size-11 place-items-center rounded-lg shadow-lg transition active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 ${
        hasCart ? 'bottom-[92px]' : 'bottom-4'
      } ${
        darkMode
          ? 'bg-white text-slate-950 shadow-black/30'
          : 'bg-slate-950 text-white shadow-slate-400/50'
      }`}
    >
      {darkMode ? <Sun size={19} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
    </button>
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
    <section className="h-full overflow-y-auto overflow-x-hidden bg-white pb-8" aria-labelledby="product-title">
      <div className="relative min-h-[308px] bg-slate-50 px-5 pb-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white text-slate-900 shadow-lg shadow-slate-200 transition active:scale-95"
        >
          <ArrowLeft size={21} strokeWidth={2.7} />
        </button>

        <button
          type="button"
          onClick={() => onReadProduct(product)}
          aria-label={`Ouvir ingredientes de ${product.name}`}
          title="Ouvir ingredientes"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white text-slate-900 shadow-lg shadow-slate-200 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <Volume2 size={19} strokeWidth={2.7} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="mx-auto h-[250px] w-full max-w-[340px] object-contain pt-8"
          draggable="false"
        />
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
            className="text-[26px] font-black leading-tight text-slate-900 outline-none"
          >
            {product.name}
          </h1>
          <p className="mt-1 text-[20px] font-black text-slate-900">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex max-w-full flex-wrap gap-2" aria-label="Ingredientes principais">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[18px] bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-slate-900">Quantidade</p>
            <div className="flex items-center gap-3">
              <StepperButton
                icon={Minus}
                label={`Diminuir quantidade de ${product.name}`}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              />
              <span className="w-7 text-center text-lg font-black">{quantity}</span>
              <StepperButton
                icon={Plus}
                label={`Aumentar quantidade de ${product.name}`}
                onClick={() => setQuantity(quantity + 1)}
              />
            </div>
          </div>

          <label className="mt-4 block text-sm font-black text-slate-900">
            Observação
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex.: sem cebola, molho separado..."
              className="mt-2 h-20 w-full resize-none rounded-[14px] bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none ring-1 ring-slate-100 placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={addCurrentItem}
            className="h-14 rounded-[14px] bg-slate-950 text-sm font-black text-white transition active:scale-[0.99]"
          >
            ADICIONAR
          </button>
          <button
            type="button"
            onClick={() => {
              addCurrentItem()
              onOrderNow()
            }}
            className="h-14 rounded-[14px] bg-[#ffda16] text-sm font-black text-black transition active:scale-[0.99]"
          >
            FAZER PEDIDO
          </button>
        </div>
      </div>
    </section>
  )
}

function SettingsScreen({
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
}) {
  const [activeTab, setActiveTab] = useState('cardapio')
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

    onAddAdminItem({
      id: `admin-${Date.now()}`,
      category: form.category,
      name: form.name.trim(),
      price,
      image: fallbackImages[form.category],
      badge: 'Admin',
      badgeTone: 'border-slate-200 bg-white text-slate-600',
      badgeIcon: Save,
      badgeIconTone: 'text-slate-600',
      description: form.description.trim() || 'Item cadastrado pelo administrador do cardápio.',
      tags: ingredients.length ? ingredients : ['Cadastro admin', 'Disponível', 'Novo item'],
    })

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
    { id: 'resumo', label: 'Resumo', icon: Settings },
  ]

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
          className="mt-4 grid grid-cols-3 gap-1 border-b border-slate-200"
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
                  <h2 className="text-base font-black text-slate-950">Novo item</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Cadastro rápido para o menu.
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
                SALVAR ITEM
              </button>
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

        {activeTab === 'resumo' && (
          <section className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <SettingsMetric label="Itens" value={products.length} />
              <SettingsMetric label="Categorias" value={categories.length} />
              <SettingsMetric label="Mesas" value={tableOptions.length} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-base font-black text-slate-950">Operação</h2>
              <div className="mt-4 divide-y divide-slate-100">
                <SettingsRow label="Cardápio" value="Ativo" />
                <SettingsRow label="Pedidos" value="Mesa e balcão" />
                <SettingsRow label="NFC/QR" value={`Mesa ${nfcTable || '01'}`} />
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

function SettingsMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-bold text-slate-500">{label}</p>
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
                onClick={onSendOrder}
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

function getTableFromUrl() {
  return new URLSearchParams(window.location.search).get('mesa') ?? ''
}

function getInitialScreen() {
  const hash = window.location.hash

  if (hash.startsWith('#produto=')) return 'produto'
  if (hash === '#pedido') return 'pedido'
  if (hash === '#configuracoes') return 'configuracoes'

  return 'menu'
}

function getInitialMenuTheme() {
  const themeParam = new URLSearchParams(window.location.search).get('tema')

  if (themeParam === 'escuro') return true
  if (themeParam === 'claro') return false

  return window.localStorage?.getItem('food99like-menu-theme') === 'dark'
}

function saveMenuTheme(enabled) {
  window.localStorage?.setItem('food99like-menu-theme', enabled ? 'dark' : 'light')
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
