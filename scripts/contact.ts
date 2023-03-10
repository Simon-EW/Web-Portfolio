// Import the type for zod errors
import type { ZodError } from 'zod';

const contactForm = document.querySelector<HTMLFormElement>('.contact-form');
const formStatus = document.querySelector<HTMLDivElement>('.popup');

interface FormInfo {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  subject: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
}

let popupTimeout: NodeJS.Timeout | null = null;

const displayError = (message: string) => {
  console.log(message);
  formStatus?.classList.add('form-error');
  formStatus?.classList.remove('form-success');
  formStatus!.textContent = message;
  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => {
    formStatus?.classList.remove('form-error');
    formStatus?.classList.remove('form-success');
    formStatus!.textContent = '';
  }, 5000);
};

const displaySuccess = (message: string) => {
  formStatus?.classList.add('form-success');
  formStatus?.classList.remove('form-error');
  formStatus!.textContent = message;
  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => {
    formStatus?.classList.remove('form-error');
    formStatus?.classList.remove('form-success');
    formStatus!.textContent = '';
  }, 5000);
};

const focusAndScrollField = (fieldName: string) => {
  const input = contactForm?.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
  input?.focus();
  input?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

/**
 *
 * @param formInfo
 * @returns true if all fields are filled in, false otherwise
 */
const checkAndErrorForm = (formInfo: FormInfo) => {
  return Object.entries(formInfo).every(([key, value]) => {
    if (!value) {
      displayError(`Please fill in the ${key} field`);
      focusAndScrollField(key);
      return false;
    }
    return true;
  });
};

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const formData = new FormData(target);

  const formInfo: FormInfo = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  if (!checkAndErrorForm(formInfo)) return;

  const res = await fetch('/api/send', {
    body: JSON.stringify(formInfo),
    method: 'POST',
  });

  if (res.status === 200) {
    target.reset();
    displaySuccess('Message sent successfully, I will get back to you soon!');
    return;
  }

  const data = await res.json();
  const error: ZodError = data.error;
  const invalidField = error.issues[0].path[0];
  focusAndScrollField(invalidField.toString());
  const issues = error.issues.map(issue => issue.message);

  displayError(issues.join(', '));
});
