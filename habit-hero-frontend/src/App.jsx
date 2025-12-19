import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [habit, setHabit] = useState("");
  const [category, setCategory] = useState("Health");
  const [frequency, setFrequency] = useState("Daily");
  const [startDate, setStartDate] = useState("");
  const [habits, setHabits] = useState([]);
  const [note, setNote] = useState("");
  const [suggestion, setSuggestion] = useState("");

    
  const quotes = [
    "Small steps every day lead to big results.",
    "Consistency is more powerful than motivation.",
    "You’re building your future one habit at a time.",
    "Progress matters more than perfection.",
    "Discipline today creates freedom tomorrow."
  ];

  const [quote, setQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const getNewQuote = () => {
    const index = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[index]);
  };



  
  const loadHabits = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/habits");
      setHabits(res.data);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  };

  
  const addHabit = async () => {
    if (!habit || !startDate) return; 

    try {
      await axios.post("http://127.0.0.1:8000/habits", {
        name: habit,
        category: category,
        frequency: frequency,
        start_date: startDate,
      });
      setHabit("");
      setStartDate("");
      loadHabits();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  
  const addCheckIn = async (habitId) => {
    if (!note) return;

    try {
      await axios.post(`http://127.0.0.1:8000/habits/${habitId}/checkin`, {
        note: note,
      });
      setNote("");
      loadHabits();
    } catch (error) {
      console.error("Error adding check-in:", error);
    }
  };

  const updateSuggestion = (selectedCategory) => {
  const suggestions = {
    Health: "Try drinking 8 glasses of water today 💧",
    Work: "Plan your top 3 tasks for today 📋",
    Learning: "Practice coding for 30 minutes 👩‍💻",
    Hobby: "Spend 20 minutes on your hobby 🎨",
    Others: "Start with one small positive habit 🌱",
  };

  setSuggestion(suggestions[selectedCategory]);
};


  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <div className="app-container">
      <div className="habit-card">
        <h1>Habit Hero</h1>
        {suggestion && (
  <div className="suggestion-box">
    💡 <strong>Suggestion:</strong> {suggestion}
  </div>
)}


              
      <div className="quote-box">
        <h3>Daily Motivation ✨</h3>
        <p>"{quote}"</p>
        <button onClick={getNewQuote}>New Quote</button>
      </div>


        
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your habit"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
          />

          <select
  value={category}
  onChange={(e) => {
    setCategory(e.target.value);
    updateSuggestion(e.target.value);
  }}
>

            <option>Health</option>
            <option>Work</option>
            <option>Learning</option>
            <option>Hobby</option>
            <option>Others</option>
          </select>

          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>Daily</option>
            <option>Weekly</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <button onClick={addHabit}>Add Habit</button>
        </div>

        <hr />

        
        <h3>Your Habits</h3>
        <div className="habit-list">
          {habits.length === 0 && <p>No habits added yet.</p>}
          {habits.map((h) => (
            <div key={h.id} className="habit-item">
              <div>
                <strong>{h.name}</strong> ({h.category}) - {h.frequency} - Starts: {h.start_date}
              </div>

              
              <div className="checkin-group">
                <input
                  type="text"
                  placeholder="Add note/check-in"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button onClick={() => addCheckIn(h.id)}>Check-in</button>
              </div>

              
              {h.checkins && h.checkins.length > 0 && (
                <ul className="notes-list">
                  {h.checkins.map((c, i) => (
                    <li key={i}>📌 {c.note}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;











