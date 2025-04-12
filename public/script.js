const list = document.getElementById('hospitalList');
const form = document.getElementById('hospitalForm');

function loadHospitals() {
  fetch('/hospitals')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach(hospital => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${hospital.name}</strong> - ${hospital.patientCount} patients - ${hospital.location}
          <button class="delete" onclick="deleteHospital(${hospital.id})">Delete</button>
        `;
        list.appendChild(li);
      });
    });
}

function deleteHospital(id) {
  fetch('/hospitals', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  }).then(() => loadHospitals());
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const patientCount = +document.getElementById('patientCount').value;
  const location = document.getElementById('location').value;

  fetch('/hospitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, patientCount, location })
  })
    .then(() => {
      form.reset();
      loadHospitals();
    });
});

loadHospitals();
