document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('classificadorInput');
  const container = document.getElementById('classificadores-container');
  const hiddenInput = document.querySelector('input[name="classificadores"]');
  let tags = [];

  if (!input || !container || !hiddenInput) return;

  function renderTags() {
    // Limpa visual
    container.querySelectorAll('.tag').forEach(tag => tag.remove());

    // Renderiza novamente
    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.classList.add('tag');
      tagEl.textContent = tag;

      const removeBtn = document.createElement('span');
      removeBtn.textContent = ' ×';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.marginLeft = '6px';
      removeBtn.onclick = () => {
        tags = tags.filter(t => t !== tag);
        hiddenInput.value = tags.join(',');
        renderTags();
      };

      tagEl.appendChild(removeBtn);
      container.insertBefore(tagEl, input);
    });

    hiddenInput.value = tags.join(',');
  }

  input.addEventListener('keyup', (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      const value = input.value.trim().replace(/,$/, '').toLowerCase();
      if (value && !tags.includes(value)) {
        tags.push(value);
        renderTags();
        input.value = '';
      }
      e.preventDefault();
    }
  });
});
