// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const stateConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: stateConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: stateConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductData = fetchedData.similar_products.map(
        eachsimilarProduct => this.getFormattedData(eachsimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductData,
        apiStatus: stateConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({apiStatus: stateConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderProductDetailsView = () => {
    const {productData, similarProductsData, quantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    return (
      <div className="product-container">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-information-container">
            <h1 className="title">{title}</h1>
            <p>Rs {price}</p>
            <div className="rating-reviews-container">
              <div className="rating-reviews-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <div className="rating-reviews-container">
              <p>Available:</p>
              <p>{availability}</p>
            </div>
            <div className="rating-reviews-container">
              <p>Brand:</p>
              <p>{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="rating-reviews-container">
              <button
                onClick={this.onDecrement}
                type="button"
                data-testid="minus"
                aria-label="Decrease quantity"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                onClick={this.onIncrement}
                type="button"
                data-testid="plus"
                aria-label="Increase quantity"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">Add to Cart</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="similar-products-container">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              key={eachSimilarProduct.id}
              similarProduct={eachSimilarProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case stateConstants.success:
        return this.renderProductDetailsView()
      case stateConstants.failure:
        return this.renderFailureView()
      case stateConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="app-container">{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
