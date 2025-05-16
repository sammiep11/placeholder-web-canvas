
import React from 'react';

const Interests = () => {
  const interests = [
    { category: "General", answer: "Vintage tech, indie games, 90s pop culture, and collecting vinyl records" },
    { category: "Music", answer: "The Cure, Depeche Mode, New Order, Joy Division, The Smiths" },
    { category: "Movies", answer: "Blade Runner, The Breakfast Club, Ferris Bueller's Day Off, Back to the Future" },
    { category: "Television", answer: "Twin Peaks, Stranger Things, X-Files, Friends, Seinfeld" },
    { category: "Books", answer: "Neuromancer, Snow Crash, Ready Player One, Hitchhiker's Guide to the Galaxy" },
    { category: "Heroes", answer: "Steve Jobs, Tim Berners-Lee, Ada Lovelace, Alan Turing" }
  ];

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Jonny's Interests</div>
      <table className="spacehey-table">
        <tbody>
          {interests.map(({ category, answer }) => (
            <tr key={category}>
              <td width="120" className="align-top p-2 font-bold">{category}</td>
              <td className="bg-blue-50 p-2">{answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Interests;
