// Save contact to Chrome storage
document.getElementById('saveContact').addEventListener('click', function () {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const address = document.getElementById('contactAddress').value.trim();
    const category = document.getElementById('contactCategory').value;
    const notes = document.getElementById('contactNotes').value.trim();
  
    if (name && email) {
      const newContact = { name, email, phone, address, category, notes };
  
      // Retrieve existing contacts
      chrome.storage.local.get({ contacts: [] }, function (result) {
        const contacts = result.contacts;
        contacts.push(newContact);
  
        // Save updated contact list
        chrome.storage.local.set({ contacts }, function () {
          alert('Contact saved!');
          resetForm();
        });
      });
    } else {
      alert('Please fill in both Name and Email fields.');
    }
  });
  
  // Search contacts
  document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    chrome.storage.local.get({ contacts: [] }, function (result) {
      const contacts = result.contacts;
      const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(query) || 
        contact.email.toLowerCase().includes(query)
      );
      displayContacts(filteredContacts);
    });
  });
  
  // View saved contacts
  document.getElementById('viewContacts').addEventListener('click', function () {
    chrome.storage.local.get({ contacts: [] }, function (result) {
      displayContacts(result.contacts);
    });
  });
  
  // Function to display contacts
  function displayContacts(contacts) {
    const contactListDiv = document.getElementById('contactList');
    contactListDiv.innerHTML = '';
  
    if (contacts.length > 0) {
      contacts.forEach((contact, index) => {
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.innerHTML = `
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
          <p><strong>Address:</strong> ${contact.address || 'N/A'}</p>
          <p><strong>Category:</strong> ${contact.category || 'N/A'}</p>
          <p><strong>Notes:</strong> ${contact.notes || 'N/A'}</p>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        contactListDiv.appendChild(contactItem);
      });
  
      // Edit functionality
      document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', function () {
          const index = this.getAttribute('data-index');
          const contact = contacts[index];
          document.getElementById('contactName').value = contact.name;
          document.getElementById('contactEmail').value = contact.email;
          document.getElementById('contactPhone').value = contact.phone;
          document.getElementById('contactAddress').value = contact.address;
          document.getElementById('contactCategory').value = contact.category;
          document.getElementById('contactNotes').value = contact.notes;
  
          // Update Save button to update instead of saving a new contact
          document.getElementById('saveContact').innerText = 'Update Contact';
          document.getElementById('saveContact').setAttribute('data-index', index);
        });
      });
  
      // Delete functionality
      document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', function () {
          const index = this.getAttribute('data-index');
          contacts.splice(index, 1);
  
          // Update the contact list in storage
          chrome.storage.local.set({ contacts }, function () {
            alert('Contact deleted!');
            document.getElementById('viewContacts').click(); // Refresh contact list
          });
        });
      });
    } else {
      contactListDiv.innerHTML = 'No contacts found.';
    }
  }
  
  // Reset form fields
  function resetForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactAddress').value = '';
    document.getElementById('contactCategory').value = '';
    document.getElementById('contactNotes').value = '';
    document.getElementById('saveContact').innerText = 'Save Contact';
    document.getElementById('saveContact').removeAttribute('data-index');
  }
  