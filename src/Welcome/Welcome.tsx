import "./Welcome.css";

export default function Welcome () {
    return <div className="Welcome">
        <div>Welcome to the Meal Plan Generator!</div> 
        <div className="Description">
            The Meal Plan Generator is designed to assist college students in managing their food budget effectively while catering to their personal preferences and dietary needs. By inputting budget ranges, closest grocery stores, food preferences, and dietary restrictions, users receive customized meal ideas for each meal of the day throughout the week. The tool not only suggests recipes but also provides a comprehensive list of necessary ingredients and estimated prices for each meal, sourced through data scraping from various grocery websites. This ensures that students can enjoy nutritious and diverse meals without exceeding their budget. </div>
    </div>
    }