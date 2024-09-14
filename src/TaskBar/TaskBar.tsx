import "./TaskBar.css";

export default function TaskBar () {
    return <div className="taskbar">
        <div>Home</div>
        <div>Info</div>
        {/* https://nodejs.org/en */}
        <div>About</div>
        <div>Nutrition Facts</div>

        {/* 
        Inside terminal:
        git clone https://github.com/html1101/meal-plan-app.git
        cd meal-plan-app
        npm install
        npm start
        */}

        <div className="menu_bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" strokeWidth={10} viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
        </div>
    </div>;
}