


const PricingCard=({ title, price, features, buttonText, recommended })=> {
    return (
      <div className={`p-6 rounded-xl shadow-md w-72 bg-white ${recommended ? 'border-2 border-green-500' : 'border'}`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-2xl font-bold text-green-600 mb-4">{price}</p>
        <button className="w-full bg-green-600 text-white py-2 rounded mb-4 hover:bg-green-700">
          {buttonText}
        </button>
        <ul className="space-y-2 text-sm text-left">
          {features.map((f, i) => (
            <li key={i}>✅ {f}</li>
          ))}
        </ul>
      </div>
    );
  }
  

export default PricingCard
