import ContactListApi from "./ContactListApi.js";

'use strict'

const CONTACT_ITEM_SELECTOR = '.contactItem';
const DELETE_BUTTON_SELECTOR = '.delete-button';
const EDIT_BUTTON_SELECTOR = '.editBtn';

const $inputs = $('input');
const $contactEl = $('#contactList');
const $addButton = $('#add-button')
const contactItemTemplate = document.querySelector('#contactItemTemplate').innerHTML;

let listContact = [];
let editContactId = null;

const $form = $('#dialog-form form')[0];
const dialog = $("#dialog-form").dialog({
  autoOpen: false,
  height: 500,
  width: 400,
  modal: true,
  buttons: {
    Save: saveContact,
    Cancel: closeModal
  },
  close: closeModal
});

$contactEl
  .on('click', EDIT_BUTTON_SELECTOR, onEditBtnClick)
  .on('click', DELETE_BUTTON_SELECTOR, onDeleteBtnClick);
$addButton.on('click', onContactListClick);

init();

function init() {
  ContactListApi.getList()
    .then(list => listContact = list)
    .then(renderContactList)
    .catch(handleError);
}

function onContactListClick(e) {
  openModal();
}

function onEditBtnClick(e) {
  const id = getContactElId(e.target);
  const contact = findContact(id);

  openModal(contact);
}

function onDeleteBtnClick(e) {
  const id = getContactElId(e.target);
  removeContact(id);
}

function saveContact() {
  const contact = getContact();

  if (!isContactValid(contact)) {
    return handleError(new Error('Incorrect input data.'));
  }

  addContact(contact);
  closeModal();
}

function getContact() {
  const contact = {};

  $inputs.each((i, input) => {
    contact[input.name] = input.value;
  })

  return contact;
}

function isContactValid(contact) {
  return !isEmpty(contact.firstName)
    && !isEmpty(contact.lastName)
    && isPhone(contact.phone);
}

function isPhone(phone) {
  return !isEmpty(phone) && !isNaN(phone);
}

function isEmpty(str) {
  return typeof str === 'string' && str.trim() === '';
}

function fillContactForm(contact) {
  for (let prop in contact) {
    if ($form.elements.hasOwnProperty(prop)) {
      $form.elements[prop].value = contact[prop];
    }
  }
}

function addContact(contact) {
  if (contact.id) {
    ContactListApi
      .update(contact.id, contact)
      .catch(handleError);

    replaceContactEl(contact.id, contact);
    contactListUpdate(contact.id, contact);
  } else {
    ContactListApi
      .create(contact)
      .then((newContact) => {
        renderContact(newContact);
        contactListAdd(newContact);
      })
      .catch(handleError);
  }
}

function removeContact(id) {
  const contactEl = getContactElById(id);

  ContactListApi
    .delete(id)
    .catch(handleError);

  contactEl.remove();
}

function renderContactList(contacts) {
  const html = contacts.map(getContactHTML).join('');

  $contactEl.html(html);
}

function renderContact(contact) {
  $contactEl.append(getContactHTML(contact));
}

function replaceContactEl(id, contact) {
  const oldContactEl = getContactElById(id);
  const newContactEl = createContactEl(contact);

  oldContactEl.replaceWith(newContactEl);
}

function contactListUpdate(id, contact) {
  const oldContact = listContact.find(c => c.id === id);

  Object.keys(contact).forEach(key => oldContact[key] = contact[key]);
}

function contactListAdd(contact) {
  listContact.push(contact);
}

function createContactEl(contact) {
  const table = document.createElement('table');

  table.innerHTML = getContactHTML(contact);

  return table.querySelector(CONTACT_ITEM_SELECTOR);
}

function getContactHTML(contact) {
  let contactItemHTML = contactItemTemplate;

  for (let prop in contact) {
    contactItemHTML = contactItemHTML.replace(`{{${prop}}}`, contact[prop]);
  }

  return contactItemHTML;
}

function getContactElById(id) {
  return $contactEl.find(`[data-id="${id}"]`);
}

function getContactElId(el) {
  return el.closest(CONTACT_ITEM_SELECTOR).dataset.id;
}

function handleError(e) {
  alert(e.message);
}

function openModal(contact = {}) {
  fillContactForm(contact);
  dialog.dialog("open");
}

function closeModal() {
  $form.reset();
  dialog.dialog("close");
}

function findContact(id) {
  return listContact.find(c => c.id === id);
}