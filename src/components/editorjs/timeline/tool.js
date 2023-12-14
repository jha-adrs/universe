class EventBlock {
    static get toolbox() {
      return {
        title: 'Event',
        icon: '',
      };
    }
  
    static get pasteConfig() {
      return {
        patterns: [{
          match: /(event:|e )(.+)/i,
          groups: ['eventTitle', 'eventDetails'],
        }],
      };
    }
  
    constructor({ data, api }) {
      this.api = api;
      this.data =  {
        title: '',
        date: '',
        location: '',
        details: '',
      };
    }
  
    render() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('event-block');
  
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.placeholder = 'Event title';
      titleInput.value = this.data.title;
      wrapper.appendChild(titleInput);
  
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.placeholder = 'Event date';
      dateInput.value = this.data.date;
      wrapper.appendChild(dateInput);
  
      const locationInput = document.createElement('input');
      locationInput.type = 'text';
      locationInput.placeholder = 'Event location (optional)';
      locationInput.value = this.data.location;
      wrapper.appendChild(locationInput);
  
      const detailsInput = document.createElement('textarea');
      detailsInput.placeholder = 'Event details';
      detailsInput.value = this.data.details;
      wrapper.appendChild(detailsInput);
  
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save Event';
      saveButton.addEventListener('click', () => {
        this.data = {
          title: titleInput.value,
          date: dateInput.value,
          location: locationInput.value,
          details: detailsInput.value,
        };
        this.save(this.data);
      });
      wrapper.appendChild(saveButton);
  
      return wrapper;
    }
  
    save(data) {
      this.data = data;
    }
  
    validate(data) {
      // Add validation logic for data (optional)
      if (!data.title) {
        return { message: 'Please enter an event title.' };
      }
      return true;
    }
  
    renderSettings() {
      // Add settings UI for the block (optional)
      return document.createElement('div');
    }
  }

  module.exports = EventBlock;