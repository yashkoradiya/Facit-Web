import React, { useState, useRef } from 'react';
import { keys } from 'helpers/keyChecker';
import { v4 as uuidv4 } from 'uuid';

const pressedKeys = {};

const valueDefinitions = [
  {
    id: 37,
    title: 'Adult',
    ageCategoryType: 'Adult',
    ageCategoryIndex: 0,
    sortOrder: 0,
    valueType: 'Absolute'
  },
  {
    id: 33,
    title: 'Child',
    ageCategoryType: 'Child',
    ageCategoryIndex: 0,
    sortOrder: 1,
    valueType: 'Absolute'
  }
];

// const flatdateBandsWithDuration = [
//   {
//     from: '2019-01-01T00:00:00',
//     id: '212',
//     to: '2020-01-01T00:00:00',
//     '1-3_37': 7,
//     '4-6_37': 10,
//     '1-3_33': 4,
//     '4-6_33': 5
//   }
// ];
const flatdateBandsWithoutDuration = [
  {
    from: '2019-01-01T00:00:00',
    id: '212',
    to: '2020-01-01T00:00:00',
    37: 7,
    33: 5
  }
];

const durationGroups = null; //[{ from: 1, to: 3 }, { from: 4, to: 6 }];

export default function SandBox() {
  const [data, setData] = useState(flatdateBandsWithoutDuration);
  const [item, setItem] = useState({});
  const startRef = useRef(null);

  const handleSubmit = e => {
    const submitedData = [...data, { ...item, id: uuidv4() }];
    setData(submitedData);
    setItem({});
    startRef.current.focus();
    e.preventDefault();
  };

  const handleValueChange = ({ target }) => {
    let existingItem = data.find(x => x.id === target.dataset.datebandid);
    if (existingItem) {
      const newData = data.map(flatDateBand => {
        if (flatDateBand.id === target.dataset.datebandid) {
          return { ...flatDateBand, [target.dataset.propertyname]: target.value };
        }
        return flatDateBand;
      });
      setData(newData);
      return;
    }

    const newItem = { ...item, [target.id]: target.value };
    setItem(newItem);
  };

  const handleKeyDown = event => {
    const { keyCode, target } = event;
    pressedKeys[keyCode] = true;

    if (!pressedKeys[keys.ctrl]) return;

    const { colindex, rowindex } = target.dataset;
    const theList = document.querySelector('.the-list');
    if (keyCode === keys.arrowDown || keyCode === keys.arrowUp) {
      const elements = theList.querySelectorAll('input[data-colindex="' + colindex + '"]');
      const currentIndex = getCurrentIndex(elements, target.id);

      if (keyCode === keys.arrowDown) focusOnNext(elements, currentIndex);
      if (keyCode === keys.arrowUp) focusOnPrevious(elements, currentIndex);
    }

    if (keyCode === keys.arrowLeft || keyCode === keys.arrowRight) {
      const elements = theList.querySelectorAll('input[data-rowindex="' + rowindex + '"]');
      const currentIndex = getCurrentIndex(elements, target.id);

      if (keyCode === keys.arrowRight) focusOnNext(elements, currentIndex);
      if (keyCode === keys.arrowLeft) focusOnPrevious(elements, currentIndex);
    }
  };

  const focusOnPrevious = (elements, currentIndex) => {
    if (currentIndex - 1 >= 0) {
      elements[currentIndex - 1].focus();
    }
  };

  const focusOnNext = (elements, currentIndex) => {
    if (currentIndex + 1 < elements.length) {
      elements[currentIndex + 1].focus();
    }
  };

  const getCurrentIndex = (elements, id) => {
    let index = 0;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const handleKeyUp = ({ keyCode }) => {
    pressedKeys[keyCode] = false;
  };

  const handleDelete = ({ target }) => {
    const id = target.id;
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
  };

  let rowCount = 0;

  return (
    <div className="the-list" data-testid="sandbox">
      <table>
        {data.length > 0 && (
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              {valueDefinitions.map((v, i) => (
                <th key={i}>{v.title}</th>
              ))}
              <th />
            </tr>
          </thead>
        )}
        <tbody>
          {data.map(flatDateBand => (
            <tr key={flatDateBand.id}>
              <td
                css={`
                  vertical-align: top;
                `}
              >
                <input
                  className="list-field"
                  type="text"
                  value={flatDateBand.from}
                  id={`${flatDateBand.id}_from`}
                  onChange={handleValueChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  data-colindex={1}
                  data-rowindex={rowCount + 1}
                  data-datebandid={flatDateBand.id}
                  data-propertyname={'from'}
                />
              </td>
              <td
                css={`
                  vertical-align: top;
                `}
              >
                <input
                  className="list-field"
                  type="text"
                  value={flatDateBand.to}
                  id={`${flatDateBand.id}_to`}
                  onChange={handleValueChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  data-colindex={2}
                  data-rowindex={rowCount + 1}
                  data-datebandid={flatDateBand.id}
                  data-propertyname={'to'}
                />
              </td>
              {durationGroups && (
                <td>
                  <table>
                    <tbody>
                      {durationGroups.map(duration => {
                        rowCount++;
                        return (
                          <tr key={`${duration.from}-${duration.to}`}>
                            <td>{`${duration.from}-${duration.to}`}</td>
                            {valueDefinitions.map((definition, definitionIndex) => {
                              const id = `${duration.from}-${duration.to}_${definition.id}`;
                              return (
                                <td key={definitionIndex}>
                                  <input
                                    className="list-field"
                                    type="text"
                                    value={flatDateBand[id] || ''}
                                    onKeyDown={handleKeyDown}
                                    onKeyUp={handleKeyUp}
                                    id={`${flatDateBand.id}_${id}`}
                                    onChange={handleValueChange}
                                    data-colindex={3 + definitionIndex}
                                    data-rowindex={rowCount}
                                    data-datebandid={flatDateBand.id}
                                    data-propertyname={id}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              )}
              {!durationGroups &&
                valueDefinitions.map((definition, definitionIndex) => {
                  const id = `${definition.id}`;
                  return (
                    <td key={definitionIndex}>
                      <input
                        className="list-field"
                        type="text"
                        value={flatDateBand[id] || ''}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        id={`${flatDateBand.id}_${id}`}
                        onChange={handleValueChange}
                        data-colindex={3 + definitionIndex}
                        data-rowindex={rowCount + 1}
                        data-datebandid={flatDateBand.id}
                        data-propertyname={id}
                      />
                    </td>
                  );
                })}
              <td>
                <input type="button" value="Delete" id={flatDateBand.id} onClick={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} autoComplete="off">
        <table>
          {data.length === 0 && (
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                {valueDefinitions.map((v, i) => (
                  <th key={i}>{v.title}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            <tr>
              <td
                css={`
                  vertical-align: top;
                `}
              >
                <input
                  ref={startRef}
                  type="text"
                  id="from"
                  key="from"
                  value={item['from'] || ''}
                  onChange={handleValueChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  data-colindex={'1'}
                  data-rowindex={`${rowCount + 1}`}
                />
              </td>
              <td
                css={`
                  vertical-align: top;
                `}
              >
                <input
                  type="text"
                  id="to"
                  key="to"
                  value={item['to'] || ''}
                  onChange={handleValueChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  data-colindex={'2'}
                  data-rowindex={`${rowCount + 1}`}
                />
              </td>
              {durationGroups && (
                <td>
                  <table>
                    <tbody>
                      {durationGroups.map((duration, durationIndex) => (
                        <tr key={`${duration.from}-${duration.to}`}>
                          <td>{`${duration.from}-${duration.to}`}</td>
                          {valueDefinitions.map((definition, definitionIndex) => {
                            const id = `${duration.from}-${duration.to}_${definition.id}`;
                            return (
                              <td key={definitionIndex}>
                                <input
                                  type="text"
                                  value={item[id] || ''}
                                  onKeyDown={handleKeyDown}
                                  onKeyUp={handleKeyUp}
                                  id={id}
                                  onChange={handleValueChange}
                                  data-colindex={`${3 + definitionIndex}`}
                                  data-rowindex={`${rowCount + durationIndex + 1}`}
                                  data-propertyname={id}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              )}
              {!durationGroups &&
                valueDefinitions.map((definition, definitionIndex) => {
                  const id = definition.id;
                  return (
                    <td key={definitionIndex}>
                      <input
                        type="text"
                        value={item[id] || ''}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        id={id}
                        onChange={handleValueChange}
                        data-colindex={`${3 + definitionIndex}`}
                        data-rowindex={`${rowCount + 1}`}
                        data-propertyname={id}
                      />
                    </td>
                  );
                })}
            </tr>
          </tbody>
        </table>
        <input type="submit" />
      </form>
    </div>
  );
}
