import {Component} from 'react'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import './App.css'

class App extends Component {
  state = {
    data: [],
    menuCategoryList:[],
    activeCategory:'Salads and Soup',
    dishCounts:{},
    cartCount:0,
  }

  componentDidMount() {
    this.getMenuCategories()
  }

  getMenuCategories = async () => {
    const apiUrl =
      'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const fetchedData = data[0]
    console.log("data")
    console.log(data)
    console.log(fetchedData.table_menu_list)
    const menuCategoryData = fetchedData.table_menu_list
    console.log(menuCategoryData)
    console.log(menuCategoryData.category_dishes)

    this.setState({ data: fetchedData, menuCategoryList: menuCategoryData})
  }

  handleCategoryChange = category => {
    this.setState({activeCategory: category})
  }


  handleAddToCart = dishId => {
    const {dishCounts, cartCount} = this.state
    const newDishCounts = {
      ...dishCounts,
      [dishId]: (dishCounts[dishId] || 0) + 1,
    }
    const newCartCount = cartCount + 1

    this.setState({
      dishCounts: newDishCounts,
      cartCount: newCartCount,
    })
  }

  handleRemoveFromCart = dishId => {
    const {dishCounts, cartCount} = this.state
    const newDishCounts = {
      ...dishCounts,
      [dishId]: Math.max((dishCounts[dishId] || 0) - 1, 0),
    }
    const newCartCount = Math.max(cartCount - 1, 0)

    this.setState({
      dishCounts: newDishCounts,
      cartCount: newCartCount,
    })
  }


  render() {
    const {data, menuCategoryList, activeCategory, dishCounts, cartCount} = this.state
    console.log('Suresh')
    console.log(data)
    return (
      <div>
        <nav className="navbar">
          <h1>{data.restaurant_name}</h1>
          <div className="cart">
            <p>My Orders</p>
            <AiOutlineShoppingCart size={25} />
            <p>{cartCount}</p>
          </div>
        </nav>
        {menuCategoryList.map(category => (
          <button
            type="button"
            key={category.menu_category}
            onClick={() => this.handleCategoryChange(category.menu_category)}
          >
            {category.menu_category}
          </button>
        ))}
        {menuCategoryList.map(category => (
          <div key={category.menu_category}>
            {activeCategory === category.menu_category && (
              <div>
                {/* Render dishes in the category */}
                {category.category_dishes.map(dish => (
                  <div key={dish.dish_id}>
                    <h2>{dish.dish_name}</h2>
                    <p>{dish.dish_calories}</p>
                    <p>
                      {dish.dish_currency} {dish.dish_price}
                    </p>
                    <p>{dish.dish_description}</p>
                    
                    {dish.addonCat.length > 0 && <p>Customizations available</p>}
                    {dish.dish_Availability === false && <p>Not available</p>}
                    {dish.dish_Availability && (
                      <div>
                        <img src={dish.dish_image} alt={dish.dish_name} />
                        <button type="button"
                          onClick={() =>
                            this.handleRemoveFromCart(dish.dish_id)
                          }
                        >
                          -
                        </button>
                        <p>{dishCounts[dish.dish_id] || 0}</p>
                        <button type="button"
                          onClick={() => this.handleAddToCart(dish.dish_id)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <p>Cart {cartCount}</p>
      </div>
    )
  }
}

export default App
