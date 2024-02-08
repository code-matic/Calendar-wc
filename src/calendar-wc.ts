import {LitElement, html} from 'lit';
import {
  customElement,
  property,
  state,
  queryAll,
  query,
} from 'lit/decorators.js';
import CalendarStyles from './calendar-wc.styles.js';
import monthNames from './utils/monthNames.js';

const MIN_DOUBLE_DIGIT = 10;

@customElement('calendar-wc')
export class Calendar extends LitElement {
  @query('.calendar') private _baseElement!: HTMLDivElement;

  @queryAll('.days') private _daysElement!: HTMLDivElement[];

  @queryAll('.header-month-year')
  private _headerMonthYearElement!: HTMLDivElement[];

  @property({type: Boolean, attribute: 'hide-select-days-footer'}) hideDaysCountFooter =  false;

  @property({type: Boolean, attribute: 'show-old-dates'}) showOldDates =  true;

  @property({type: Boolean, attribute: 'show-date-preview'}) showDatePreview =  true;

  @property({type: Boolean, attribute: 'elevate'}) elevate = false;

  @property({type: Boolean, attribute: 'disabled'}) disabled = false;

  @property({type: String, attribute: 'highlight-dates'})
  highlightDates = '';

  @property({type: String, attribute: 'blur-dates'})
  blurDates = '';

  @property({type: String, attribute: 'blur-dates-range'})
  blurDateRange = '';

  @property({ type: String , attribute: 'button-color'}) buttonColor = '';

  @state() private _date: Date = new Date();

  @state() private _selectedDates: string[] = [];

  @state() private _totalSelectedDates = 0;

  static override styles = CalendarStyles;

  override firstUpdated() {
    this.renderTwoColumnCalendar();
    this.renderSingleColumnCalendar();
    if (this.elevate) this._baseElement.classList.add('elevate');
  }

  override updated() {
    this.attachOnSelectDateEventListener();
    if (this.highlightDates) this.renderHighlightedDates();
    if (this.blurDates) this.renderBlurredDates();
    if (this.blurDateRange) this.renderBlurredDateRange();
    if (this._selectedDates.length === 2) {
      this.renderSelectedDateRange();
    }
  }

  attachOnSelectDateEventListener() {
    if (this.disabled) return;
    this.renderRoot
      .querySelector('.today')
      ?.addEventListener('click', this.onSelectDate);
    this.renderRoot
      .querySelectorAll('.future-date')
      .forEach((el) => el.addEventListener('click', this.onSelectDate));
    this.renderRoot
      .querySelectorAll('.past-date')
      .forEach((el) => el.addEventListener('click', this.onSelectDate));
  }

  renderSelectedDateRange() {
    let totalDateRange = 0;
    const [year1, month1, day1] = this._selectedDates[0].split('/');
    const startDate = new Date(+year1, Number(month1) - 1, +day1);
    const [year2, month2, day2] = this._selectedDates[1].split('/');
    const endDate = new Date(+year2, Number(month2) - 1, +day2);

    this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
      if (el instanceof HTMLDivElement && el.dataset.date) {
        const [year3, month3, day3] = el.dataset.date.split('/');
        const date = new Date(+year3, Number(month3) - 1, +day3);
        if (date > startDate && date < endDate) {
          el.classList.add('selected-range');
          totalDateRange += 1;
        }
      }
    });
    this._totalSelectedDates =
      this._totalSelectedDates > this._selectedDates.length
        ? this._totalSelectedDates
        : this._selectedDates.length + totalDateRange;
  }


  listDates(startDate : string, endDate: string): Date[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList: Date[] = [];
    while (start <= end) {
      dateList.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return dateList;
  }


  formatDateList(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }


  renderTwoColumnCalendar = () => {
    for (let columnIndex = 0; columnIndex < 2; columnIndex += 1) {
      let daysBuilder = '';
      this._date.setDate(1);
      this.setDateMonthAndYearBasedOnCalendarColumn(columnIndex);
      this.renderMonthNameInCalendarColumnHeader(columnIndex);
      daysBuilder += this.previousMonthDaysInCurrentMonthBuilder();
      daysBuilder += this.calendarDaysBuilder();
      this.renderDaysBasedOnCalendarColumn(daysBuilder, columnIndex);
    }
  };

  renderSingleColumnCalendar = () => {
    const columnIndex = 1;
      let daysBuilder = '';
      this._date.setDate(1);
      this.renderMonthNameInCalendarColumnHeader(columnIndex);
      daysBuilder += this.previousMonthDaysInCurrentMonthBuilder();
      daysBuilder += this.calendarDaysBuilder();
      this.renderDaysBasedOnCalendarColumn(daysBuilder, columnIndex);
  };

  setDateMonthAndYearBasedOnCalendarColumn(columnIndex: number) {
    const nextMonth = this._date.getMonth() + columnIndex;
    if (nextMonth >= 12) {
      this._date.setMonth(0);
      this._date.setFullYear(this._date.getFullYear() + 1);
    } else {
      this._date.setMonth(nextMonth);
    }
  }

  renderMonthNameInCalendarColumnHeader(columnIndex: number) {
    this._headerMonthYearElement[columnIndex].innerHTML = `${
      monthNames[this._date.getMonth()]
    } ${this._date.getFullYear()}`;
  }

  renderDaysBasedOnCalendarColumn(days: string, columnIndex: number) {
    const leftSide = 0;
    const leftMonthDays = this._daysElement[0];
    const rightMonthDays = this._daysElement[1];
    if (columnIndex === leftSide) leftMonthDays.innerHTML = days;
    else rightMonthDays.innerHTML = days;
  }

  previousMonthDaysInCurrentMonthBuilder(): string {
    let days = '';
    const firstDayIndex = this._date.getDay();
    for (let x = firstDayIndex; x > 0; x -= 1) {
      days += `<div class="last-month-days"></div>`;
    }
    return days;
  }

  calendarDaysBuilder(): string {
    let days = '';
    const lastDay = this.getLastDayOfDateMonth();
    for (let day = 1; day <= lastDay; day += 1) {
      if (this.isToday(day)) {
        days += this.dayElement('today', day);
      } 
      else if (this.isPastDate(day, lastDay)) {
        days += this.dayElement(this.showOldDates ? 'past-date' : 'hide-past-date', day);
      } 
      else {
        days += this.dayElement('future-date', day);
      }
    }
    return days;
  }

  dayElement(className: string, day: number): string {
    return `<div class=${className} data-date=${this.formatDate(
      day
    )}>${day}</div>`;
  }

  formatDate(day: number): string {
    const month = this._date.getMonth() + 1;
    const date = `${this._date.getFullYear()}/${
      month < MIN_DOUBLE_DIGIT ? `0${month}` : month
    }/${day < MIN_DOUBLE_DIGIT ? `0${day}` : day}`;
    return date;
  }

  getLastDayOfDateMonth() {
    return new Date(
      this._date.getFullYear(),
      this._date.getMonth() + 1,
      0
    ).getDate();
  }

  isToday(dayOfTheMonth: number): boolean {
    return (
      dayOfTheMonth === new Date().getDate() &&
      this._date.getMonth() === new Date().getMonth() &&
      this._date.getFullYear() === new Date().getFullYear()
    );
  }

  isPastDate(day: number, lastDay: number): boolean {
    return (
      this.isPastDayOfCurrentMonthAndYear(day) ||
      this.isPastDayOfPreviousMonthAndCurrentYear(day, lastDay) ||
      this.isPastMonthAndYear() ||
      this.isPastYear()
    );
  }


  isPastDayOfCurrentMonthAndYear(dayOfTheMonth: number): boolean {
    return (
      dayOfTheMonth < new Date().getDate() &&
      this._date.getMonth() === new Date().getMonth() &&
      this._date.getFullYear() === new Date().getFullYear()
    );
  }

  isPastDayOfPreviousMonthAndCurrentYear(
    dayOfTheMonth: number,
    lastDayofTheMonth: number
  ): boolean {
    return (
      dayOfTheMonth <= lastDayofTheMonth &&
      this._date.getMonth() < new Date().getMonth() &&
      this._date.getFullYear() === new Date().getFullYear()
    );
  }

  isPastMonthAndYear(): boolean {
    return (
      this._date.getMonth() < new Date().getMonth() &&
      this._date.getFullYear() < new Date().getFullYear()
    );
  }

  isPastYear(): boolean {
    return this._date.getFullYear() < new Date().getFullYear();
  }
  
  moveToPreviousMonth() {
    if (window.innerWidth >= 414) {
      this._date.setMonth(this._date.getMonth() - 3);
    } else {
      this._date.setMonth(this._date.getMonth() - 1);
    }
    this.renderCalendarWithSelectedDates();
  }

  moveToNextMonth() {
    const monthToAdd = 1;
    this._date.setMonth(this._date.getMonth() + monthToAdd);
    this.renderCalendarWithSelectedDates();
  }

  renderCalendarWithSelectedDates() {
      const width = window.innerWidth;
      if (width >= 414) {
        this.renderTwoColumnCalendar();
      } else {
        this.renderSingleColumnCalendar();
      }

    this.renderSelectedDates();
    this.requestUpdate();
  }

  renderSelectedDates() {
    this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
      if (
        el instanceof HTMLDivElement &&
        el.dataset.date &&
        this._selectedDates.includes(el.dataset.date)
      ) {
        el.classList.add('selected');
      }
    });
  }

  renderHighlightedDates() {
    this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
      if (
        el instanceof HTMLDivElement &&
        el.dataset.date &&
        this.highlightDates
          .replaceAll(' ', '')
          .split(',')
          .includes(el.dataset.date)
      ) {
        el.classList.add('selected');
      }
    });
  }


  // Blurs a single date
  renderBlurredDates() {
    this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
      if (
        el instanceof HTMLDivElement &&
        el.dataset.date &&
        this.blurDates.replaceAll(' ', '').split(',').includes(el.dataset.date)
      ) {
        el.classList.add('blur-date');
      }
    });
  }

  // Blurs a date range
  renderBlurredDateRange() {
     const stringToArray = JSON.parse(this.blurDateRange.replaceAll(/'/g, '"'))
      if (this.blurDateRange.length >= 2) {
        const startDate = stringToArray[0]
        const endDate = stringToArray[1];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listDates(startDate, endDate).map((listedDate) => (
          this.formatDateList(listedDate),
        // console.log(this.formatDateList(listedDate)),
        this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
          if (
            el instanceof HTMLDivElement &&
            el.dataset.date &&
            this.formatDateList(listedDate).replaceAll(' ', '').split(',').includes(el.dataset.date)
          ) {
            el.classList.add('blur-date');
          }
        })
          ))


    }
  }


  onSelectDate = (event: Event) => {
    const element = event.target as HTMLElement;
    const selectedDate = element.dataset.date;
    if (!selectedDate) return;

    if (this._selectedDates.length === 2) {
      this.clearSelectedDates();
    }

    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
      this._selectedDates = this._selectedDates.filter(
        (date: string) => date !== selectedDate);
    } else {
      if (
        this._selectedDates.length === 1 &&
        selectedDate < this._selectedDates[0]
        
      ) {
        this.clearSelectedDates();
      }
      element.classList.add('selected');
      this._selectedDates.push(selectedDate);
      this._totalSelectedDates = this._selectedDates.length;
      this.getMinMaxDates(this._selectedDates);
    }
    this.requestUpdate();
  };

  clearSelectedDates() {
    this._selectedDates = [];
    this._totalSelectedDates = 0;
    this.renderRoot.querySelectorAll('.days > div').forEach((el) => {
      el.classList.remove('selected');
      el.classList.remove('selected-range');
    });
    this.requestUpdate();
  }

  convertDateToTimestamp = (date: string): number => {
    const dateArray = date.split('/');
    const dateObject = new Date(
      Number(dateArray[2]),
      Number(dateArray[1]) - 1,
      Number(dateArray[0])
    );
    return dateObject.getTime();
  };

  convertTimestampToDate = (timestamp: number): string => {
    const dateObject = new Date(timestamp);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${day < MIN_DOUBLE_DIGIT ? `0${day}` : day}/${
      month < MIN_DOUBLE_DIGIT ? `0${month}` : month
    }/${year}`;
  };

  getMinMaxDates(dates: string[]): string[] {
    const minDate = Math.min(...dates.map(this.convertDateToTimestamp));
    const maxDate = Math.max(...dates.map(this.convertDateToTimestamp));
    return [
      this.convertTimestampToDate(minDate),
      this.convertTimestampToDate(maxDate),
    ];
  }

  doneSelectingDate() {
    this.dispatchEvent(
      new CustomEvent('dates-selected', {
        detail: {
          selectedDates: this._selectedDates,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  convertSelectedDate(item: string) {
    const inputDate = new Date(item)
    const options : Intl.DateTimeFormatOptions = {year: "numeric", month: "short", day: "numeric"};
    const formattedDate = inputDate.toLocaleDateString("en-US", options);
    if (this._selectedDates[0] !== undefined) 
      return formattedDate
    else return ("No date") 
  }

  calendarMonthTemplate = () => html`<div class="month">
    <div class="weekdays">
      ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
        (day) => html`<div>${day}</div>`
      )}
    </div>
    <div class="days"></div>
  </div>`;

  calendarSelectedDaysFooterTemplate = () => html`<div class="calendar-footer">
    <button class="clear-dates-btn" @click=${this.clearSelectedDates}>
      Clear Dates
    </button>
    <p class="selected-days-text">
      Selected:
      <strong>
        ${this._totalSelectedDates > 1
          ? `${this._totalSelectedDates} days`
          : `${this._totalSelectedDates} day`}
      </strong>
    </p>
    <button class="${this.buttonColor} done-btn" @click=${this.doneSelectingDate}>Apply</button>
  </div>`;

  calendarFooterTemplate = () => html`
    <div class="calender-footer-apply">
        <button class="cancel-btn" @click=${this.clearSelectedDates}>Clear Dates</button>
        <button class="apply-btn" @click=${this.doneSelectingDate}>Apply</button>
    </div> `;

  calendarPreviewDateTemplate = () => html`
    <div class="calendar-preview" part="preview">
      <div>${this.convertSelectedDate(this._selectedDates[0])}</div>
      <span>-</span>
      <div>${this.convertSelectedDate(this._selectedDates[this._selectedDates.length -1])}</div>
    </div>
`;

  override render() {
    return html`
    <div class="calendar">
      <div class="calendar-header">
        <div class="header">
          <button class="nav-btn" @click=${this.moveToPreviousMonth}>
            <svg
              width="24"
              height="24"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <p class="header-month-year"></p>
        </div>

        <div class="header">
        <button class="nav-btn mobile" @click=${this.moveToPreviousMonth}>
            <svg
              width="24"
              height="24"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <p class="header-month-year"></p>
          <button class="nav-btn" @click=${this.moveToNextMonth}>
            <svg
              width="24"
              height="24"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
    </div>

      ${this.showDatePreview ? this.calendarPreviewDateTemplate() : ""}

      <div class="month-container">
        ${this.calendarMonthTemplate()} ${this.calendarMonthTemplate()}
      </div>
      ${this.hideDaysCountFooter ? this.calendarFooterTemplate() : this.calendarSelectedDaysFooterTemplate()}
    </div>`;
  }

  //  override createRenderRoot() {
  //   return this;
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendar-wc': Calendar;
  }
}
