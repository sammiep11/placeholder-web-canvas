
import React from 'react';

const Interests = () => {
  const interests = [
    { category: "General", answer: "kdfldnflvndlns;ljp ojwpkjf;" },
    { category: "Music", answer: "dfklvdnvld  lwndf wm fwm" },
    { category: "Movies", answer: "ldsnlvslls ld" },
    { category: "Television", answer: "kefglnvld sdklsn  lsjndflsn3 i23ro" },
    { category: "Books", answer: "skdmvlf nlwjefwnl" },
    { category: "Heroes", answer: "ls;dkn;ck 9kdjlsnl" }
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
