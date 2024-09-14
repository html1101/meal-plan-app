import { useState } from "react";
import "./Questions.css";
import { QuestionType } from "../App";

// Min amount to spend on groceries
const min = 50;
// Max amount to spend on groceries
const max = 500;

export default function Questions ({ setQuestionAnswers }: { setQuestionAnswers: React.Dispatch<React.SetStateAction<QuestionType | null>> }) {
    const [grocery_amt, set_grocery_amt] = useState(50);
    const [grocery_store, set_grocery_store] = useState("giant_eagle");
    return <div className="question_list">
        <h2>To begin, tell us a little about yourself.</h2>

        <div>
            <div className="question_temp">
                <div className="question">What is your approximate grocery budget per week?</div>
                <div className="measurement_grocery">
                    ${min} <input
                    type="range"
                    min={min}
                    max={max}
                    onChange={(evt) => set_grocery_amt(Number(evt.currentTarget.value))}
                    value={grocery_amt}
                    step={(max - min) / 20}/> ${max}
                </div>
                <div className="large-txt">
                    ${Math.round(grocery_amt)}
                </div>
            </div>
            <br />
            <div className="align-left">
                What grocery store do you prefer to shop at?
                <br />
                <label>
                    <input
                        type="radio"
                        name="grocery_store"
                        value="giant_eagle"
                        checked={grocery_store === "giant_eagle"}
                        onChange={() => set_grocery_store("giant_eagle")}
                        defaultChecked/> Giant Eagle
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="grocery_store"
                        value="target"
                        checked={grocery_store === "target"}
                        onChange={() => set_grocery_store("target")}
                        /> Target
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="grocery_store"
                        value="aldi"
                        checked={grocery_store === "aldi"}
                        onChange={() => set_grocery_store("aldi")}
                        /> Aldi's
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="grocery_store"
                        value="trader_joes"
                        checked={grocery_store === "trader_joes"}
                        onChange={() => set_grocery_store("trader_joes")}
                        /> Trader Joe's
                </label>
            </div>
            <br />
            <div>
                Do you have any dietary preferences?
                {/* TODO: Put here */}
            </div>
        </div>
        <div
            className="start"
            onClick={() => {
                // Save the information we got + send over to next state
                setQuestionAnswers({ amount: grocery_amt, store: grocery_store });
            }}>
            Start
        </div>
    </div>;
}