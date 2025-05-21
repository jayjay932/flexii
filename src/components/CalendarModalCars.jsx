import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarModalCars({ isOpen, onClose, listingId, availabilityMap }) {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleDateClick = (dateStr) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(dateStr);
      setSelectedEndDate(null);
    } else {
      const newDate = new Date(dateStr);
      const start = new Date(selectedStartDate);
      if (newDate < start) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(dateStr);
      } else {
        setSelectedEndDate(dateStr);
      }
    }
  };

  const handleValidate = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('Veuillez sélectionner une date de début et une date de fin.');
      return;
    }
    onClose();
    navigate(
      `/checkout_cars?id=${listingId}` +
      `&start_date=${selectedStartDate}` +
      `&end_date=${selectedEndDate}`
    );
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const isAvailable = availabilityMap?.[dateStr];
      const today = new Date(); today.setHours(0,0,0,0);
      const current = new Date(dateStr);
      let style = {
        padding: '10px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer',
      };
      let selectable = true;
      if (isAvailable === 0 || current < today) {
        style = { ...style, textDecoration:'line-through', color:'red', backgroundColor:'#fbeaea', cursor:'not-allowed' };
        selectable = false;
      }
      if (selectedStartDate && selectedEndDate) {
        const start = new Date(selectedStartDate);
        const end = new Date(selectedEndDate);
        if (current >= start && current <= end) {
          style = { ...style, backgroundColor:'#d4edda', borderColor:'#28a745', color:'#155724' };
        }
      } else if (selectedStartDate === dateStr) {
        style = { ...style, backgroundColor:'#d4edda', borderColor:'#28a745', color:'#155724' };
      }
      cells.push(
        <div
          key={dateStr}
          style={style}
          onClick={() => selectable && handleDateClick(dateStr)}
        >{day}</div>
      );
    }
    return cells;
  };

  if (!isOpen) return null;

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div style={{background:'white',padding:'20px',borderRadius:'12px',width:'90%',maxWidth:'600px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button onClick={() => changeMonth(-1)}>&#10094;</button>
          <h2>{['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][currentMonth]} {currentYear}</h2>
          <button onClick={() => changeMonth(1)}>&#10095;</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',fontWeight:'bold',textAlign:'center',marginTop:'10px'}}>
          {daysOfWeek.map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{display:'flex',gap:'20px',marginTop:'20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,minmax(30px,1fr))',gap:'5px',flex:'1 1 300px'}}>
            {renderCalendar()}
          </div>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',flex:'0 1 200px'}}>
            <button type="button" onClick={onClose} className="btn" style={{backgroundColor:'gray',padding:'8px 12px',fontSize:'14px'}}>Fermer</button>
            <button type="button" onClick={handleValidate} className="btn" style={{marginTop:'10px',padding:'8px 12px',fontSize:'14px'}}>Valider</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModalCars;
