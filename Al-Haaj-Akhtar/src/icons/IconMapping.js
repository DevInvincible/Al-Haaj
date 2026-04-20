// Map menu item categories to their corresponding image paths
const imageMap = {
  'Burgers': '/burger.png',
  'Burger': '/burger.png',
  'Broast': '/chicken-leg.png',
  'DrumStick': '/chicken-leg.png',
  'Fries': '/french-fries.png',
  'Wraps': '/wrap.png',
  'Wrap': '/wrap.png',
  'Drinks': '/drink.png',
  'Drink': '/drink.png',
  'Pizza': '/pizza.png',
  'Pizzas': '/pizza.png',
  'Combos': '/burger.png',
  'Combo': '/burger.png',
  'Deals': '/burger.png',
  'Meal': '/burger.png',
  'Pasta': '/spaghetti.png',
  'Twister': '/tacos.png'
}

export const getCategoryIcon = (category) => {
  return imageMap[category] || '/burger.png'
}

// Get image path(s) by item name (returns single path or array for combos)
export const getItemIcon = (item) => {
  const name = item.name?.toLowerCase() || ''
  const category = item.category?.toLowerCase() || ''
  
  // Check for burger + fries combo items first - return both images
  if (name.includes('burger with fries') || 
      ((name.includes('junior') || name.includes('mini')) && (name.includes('w f') || name.includes('wf'))) ||
      (name.includes('chicken burger') && (name.includes('w f') || name.includes('wf'))) ||
      ((name.includes('burger') || name.includes('zinger')) && name.includes('w f') && !name.includes('chicken')) ||
      // Additional checks for items that should show as combos
      (name.includes('junior') && name.includes('zinger')) ||
      (name.includes('mini') && name.includes('zinger'))) {
    return ['/burger.png', '/french-fries.png']
  }
  
  // Check for chicken + fries combo
  if ((name.includes('chicken') && name.includes('fries')) ||
      (name.includes('wrap') && name.includes('fries'))) {
    return ['/chicken-leg.png', '/french-fries.png']
  }
  
  // Check for other combo/meal items
  if (name.includes('combo') || name.includes('meal') || name.includes('deal') || 
      name.includes('bundle')) {
    return '/burger.png'
  }
  
  // Check name first for specific items - TWISTER before chicken
  if (name.includes('twister')) return '/wrap.png'
  if (name.includes('burger') || name.includes('zinger') || name.includes('cheese')) return '/burger.png'
  if (name.includes('chicken') || name.includes('crispy') || name.includes('wings') || name.includes('broast')) return '/chicken-leg.png'
  if (name.includes('drum') || name.includes('stick') || name.includes('drumstick')) return '/fried-chicken.png'
  if (name.includes('fries') || name.includes('loaded')) return '/french-fries.png'
  if (name.includes('wrap') || name.includes('shawarma') || name.includes('sandwich')) return '/taco.png'
  if (name.includes('drink') || name.includes('soda') || name.includes('cola') || name.includes('pepsi')) return '/drink.png'
  if (name.includes('pizza') || category.includes('pizza')) return '/pizza.png'
  
  // Fallback to category
  return getCategoryIcon(item.category)
}
