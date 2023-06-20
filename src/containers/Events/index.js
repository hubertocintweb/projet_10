import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = ((data && data.events) || []).filter((event) => {
    if (event.type === type || !type) {
      return true;
    }
    return false;
  });
  const pager = (index) => {
    let res = false;
    if (currentPage === 1) {
      res = currentPage + index <= currentPage * PER_PAGE ;
    } else {
      res =
        (index + 1) <= currentPage * PER_PAGE &&
        (index + 1) > (currentPage - 1) * PER_PAGE;
    }
    return res;
  };

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  const changeHandler = (event) =>
    event ? changeType(event) : changeType(null);
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select selection={Array.from(typeList)} onChange={changeHandler} />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event, index) => (
              <div key={event.id}>
                {pager(index) && (
                  <Modal
                    key={event.id}
                    Content={
                      <ModalEvent event={event} key={`${event.id}event`} />
                    }
                  >
                    {({ setIsOpened }) => (
                      <div>
                        {event && (
                          <EventCard
                            onClick={() => setIsOpened(true)}
                            imageSrc={event.cover}
                            title={event.title}
                            date={new Date(event.date)}
                            label={event.type}
                          />
                        )}
                      </div>
                    )}
                  </Modal>
                )}
              </div>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
