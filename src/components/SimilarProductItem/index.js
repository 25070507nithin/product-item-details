// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {title, brand, price, imageUrl, rating} = similarProduct
  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <p>{title}</p>
      <p>by {brand}</p>
      <div>
        <p>{price}</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
