import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Premium Cosmetics Store</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the finest beauty products for your skincare, makeup, and haircare needs
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Store?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-primary-500 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders above Rs. 2000</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-primary-500 text-4xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">100% Authentic</h3>
              <p className="text-gray-600">Guaranteed genuine products</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-primary-500 text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/shop?category=skincare"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-2">🧴</div>
              <h3 className="font-bold">Skincare</h3>
            </Link>
            <Link
              to="/shop?category=makeup"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-2">💄</div>
              <h3 className="font-bold">Makeup</h3>
            </Link>
            <Link
              to="/shop?category=haircare"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-2">💇‍♀️</div>
              <h3 className="font-bold">Haircare</h3>
            </Link>
            <Link
              to="/shop?category=fragrance"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl mb-2">🌸</div>
              <h3 className="font-bold">Fragrance</h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-xl">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Best cosmetics store in Pakistan! The products are genuine and delivery is super fast."
              </p>
              <p className="font-bold">- Sarah K.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-xl">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Amazing collection and excellent customer service. Highly recommended!"
              </p>
              <p className="font-bold">- Ayesha M.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-xl">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4">
                "The quality of products is exceptional. Will definitely shop again!"
              </p>
              <p className="font-bold">- Fatima R.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;