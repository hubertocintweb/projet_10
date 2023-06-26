import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
  const [intervalId, setIntervalId] = useState(null);

  const changeCard = (idx) => {
    setIndex(idx);
    // clear auto slider
    clearInterval(intervalId);
  };

  useEffect(() => {
    // wait byDateDesc is ready and execute one only time
    if (byDateDesc && !intervalId) {
      // use setInterval instead of setTimeOut
      const id = setInterval(() => {
        // pass callback function to setIndex to get current index
        // index var doesn't work because we are inside an interval function
        setIndex((currentIndex) => {
          let nextIndex = 0;
          nextIndex =
            currentIndex < byDateDesc.length - 1 ? currentIndex + 1 : 0;
          return nextIndex;
        });
      }, 5000);
      setIntervalId(id);
    }
  }, [setIndex, setIntervalId, byDateDesc, index, intervalId]);
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={event.description}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event2, radioIdx) => (
            <input
              key={`${event2.title}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly
              onClick={() => {
                changeCard(radioIdx);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
