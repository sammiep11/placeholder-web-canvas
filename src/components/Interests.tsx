
import React from 'react';

const Interests = () => {
  const categories = [
    "General",
    "Music",
    "Movies",
    "Television",
    "Books",
    "Heroes"
  ];

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Jonny's Interests</div>
      <table className="spacehey-table">
        <tbody>
          {categories.map(category => (
            <tr key={category}>
              <td width="120">{category}</td>
              <td className="bg-blue-50"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Interests;
