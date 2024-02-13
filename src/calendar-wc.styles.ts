import {css} from 'lit';

const CalendarStyles = css`
  :host {
    display: block;
  }

  * {
    font-family: 'Montserrat', sans-serif !important;
    box-sizing: border-box;
  }


  .calendar {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .calendar.elevate {
    -webkit-box-shadow: 0 2px 16px rgb(0 0 0 / 15%);
    box-shadow: 0 2px 16px rgb(0 0 0 / 15%);
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media (max-width: 414px) {
    .calendar-header {
    display: flex;
    align-items: center;
    width: 100%;
  }
  }

  .calendar-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 56px;
    border-top: 1.5px solid #eeeeee;
    padding: 0 12px;
  }

  .calender-footer-apply {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 12px;
    border-top: 1.5px solid #eeeeee;
  }

  .calender-footer-apply button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 16px;
  }

  .cancel-btn {
    border-radius: 8px;
    border: 1px solid #D0D5DD;
    background: #FFF;

  }

  .apply-btn {
  border-radius: 8px;
  border: 1px solid #eda075;
  background: #eda075;
  color: #fff;
  }

  .header {
    width: 240px;
    height: 56px;
    display: flex;
    align-items: center;
  }

  .header .mobile{
    display: none;
  }

  .header:nth-child(1) {
    padding: 0 32px 0 8px;
  }

  @media (max-width: 414px) {
    .header:nth-child(1) {
      display: none;
  }

    .header:nth-child(2) {
      padding: 0 24px !important;
      width: 100%;
  }

  .header .mobile{
    display: block;
  }

  .calender-footer-apply button {
    width: 100px;
    font-size: 14px;
    padding: 10px;
  }

  }

  .header:nth-child(2) {
    padding: 0 8px 0 32px;
  }

  .month-container {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 414px) {
    .month-container {
    display: grid;
  }

  .month {
    width: 100% !important;
    height: auto;
  }

  .month:nth-child(1) {
    display: none;
  }

  .clear-dates-btn {
    padding: 8px !important;
  }

  .done-btn {
    padding: 8px  !important;
  }

  .clear-dates-btn,
  .done-btn {
    width: fit-content
  }
  }

  .month {
    width: 48%;
    height: auto;
  }

  .weekdays {
    width: 100%;
    padding: 0 6.4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .weekdays div {
    font-size: 0.75rem;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bebebe;
    width: 14.2857%;
  }


  .clear-dates-btn,
  .done-btn {
    font-weight: 600;
    font-size: 0.75rem;
    cursor: pointer;
    width: 130px;
  }

  .clear-dates-btn {
    padding: 0;
    border-radius: 8px;
    border: 1px solid rgb(208, 213, 221);
    background: rgb(255, 255, 255); 
    padding: 10px 16px
  }

  .done-btn {
    background-color: #eda075;
    color: #fff;
    border-radius: 0.3rem;
    border: 0;
    padding: 10px 16px
  }

  .selected-days-text {
    font-size: 0.75rem;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-btn {
    background-color: transparent;
    border: none;
    padding: 0;
    margin-top: 4px;
    cursor: pointer;
  }

  .header-month-year {
    font-size: 0.8rem;
    font-weight: 700;
    flex: 1;
    text-align: center;
  }
  

  .days {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 3.2px;
  }

  .days div {
    font-size: 0.75rem;
    width: 14.2857%;
    height: 44.4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  @media (min-width: 595px) {
    .days div {
    font-size: 0.9rem;
    height: 40px;
  }

  .weekdays div {
    font-size: 0.9rem;
  }

  .header-month-year {
    font-size: 0.9rem;
  }
}

  @media (min-width: 755px) {
    .days div {
    height: 50px;
    font-size: 1rem;
  }

  .weekdays div {
    font-size: 1rem;
  }

  .header-month-year {
    font-size: 1rem;
  }

  .clear-dates-btn,
  .done-btn {
    font-size: 1rem;
  }

  .selected-days-text {
    font-size: 1rem;
  }

}

  .last-month-days {
    cursor: default !important;
  }

  .hide-past-date,
  .blur-date {
    color: #909090;
    opacity: 0.4;
    cursor: not-allowed !important;
    pointer-events: none;
    position: relative;
  }

  
  .blur-date::before  {
    content: "Date Unavailable";
    text-align: center;
    position: absolute;
    bottom: 60%;
    left: 50%;
    width: max-content;
    transform: translateX(-50%);
    background-color: #0e0d0d !important;
    color: #fff;
    padding: 8px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    font-size: 12px;
  }

  .blur-date:hover::before {
  opacity: 1;
  background-color: #0e0d0d !important;
  }


  .today.selected,
  .future-date.selected {
    background-color: #eda075;
    color: #fff;
    border-radius: 100%;
    position:relative;
  }

  .past-date.selected:hover .tooltiptext,
  .today.selected:hover .tooltiptext,
  .future-date.selected:hover .tooltiptext {
    visibility: visible;
  }

  .future-date.selected-range {
    background-color: hsl(22, 50%, 95%);
    color: #000;
    border-radius: 100%;
  }

  .past-date.selected {
    background-color: #eda075;
    color: #fff;
    border-radius: 100%;
    position:relative;
  }

  .past-date.selected-range {
    background-color: hsl(22, 50%, 95%);
    color: #000;
    border-radius: 100%;
  }

  .calendar-preview {
    display: flex;
    justify-content: space-between;
    padding: 0 20px 20px;
  }

  .calendar-preview div{
  width: 140px;
  border-radius: 8px;
  border: 1px solid #D0D5DD;
  background: #FFF;
  padding: 10px 16px;
  display : flex;
  justify-content: center;
  }

  .calendar-preview span{
    display: flex;
    justify-content: center;
    align-items: center;
  }



  @media (max-width: 414px) {
  .calendar-preview div{
    width: 100px;
    font-size: 12px;
    padding: 10px;
  }
  }
`;

export default CalendarStyles;
