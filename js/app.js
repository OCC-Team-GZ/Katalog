/* js/app.js */

let katalogData = [];

// Fungsi untuk mengambil data JSON dari folder Tema/
async function loadKatalogData() {
    try {
        const response = await fetch('./Tema/data_katalog.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        katalogData = await response.json();
        
        // Set indeks varian default aktif = 0 untuk tiap tema
        katalogData.forEach(item => item.activeVariantIndex = 0);

        renderKatalog();
    } catch (error) {
        console.error("Gagal memuat data katalog JSON:", error);
    }
}

// Render kartu katalog ke HTML
function renderKatalog() {
    const container = document.getElementById('katalog-container');
    const totalEl = document.getElementById('total-items');
    
    if (totalEl) totalEl.textContent = katalogData.length;
    container.innerHTML = '';

    katalogData.forEach((item, itemIdx) => {
        const currentVar = item.variations[item.activeVariantIndex];
        
        const waMessage = encodeURIComponent(`Halo Kak, saya mau pesan tema undangan: *${item.title}* (Varian: *${currentVar.name}*) harga ${currentVar.price}`);
        const waUrl = `https://wa.me/${item.waNumber}?text=${waMessage}`;

        const cardHTML = `
            <div class="bg-white rounded-2xl overflow-hidden border border-slate-200 card-shadow flex flex-col justify-between relative">
                <div class="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                    ${item.badge}
                </div>

                <div>
                    <div class="relative w-full aspect-square bg-slate-100 overflow-hidden"">
                        <img id="img-${itemIdx}" 
                             src="${currentVar.image}" 
                             alt="${currentVar.name}" 
                             class="w-full h-full object-cover transition-all duration-300 transform hover:scale-105"
                             onerror="this.onerror=null;this.src='https://placehold.co/600x400/333333/FFFFFF?text=Preview+Gambar';"
                        />
                    </div>

                    <div class="p-5">
                        <h3 class="font-montserrat font-extrabold text-slate-800 text-lg uppercase tracking-wide">
                            ${item.title}
                        </h3>
                        <p class="text-xs text-slate-500 mb-3">Varian Aktif: <span id="var-name-${itemIdx}" class="font-semibold text-slate-700">${currentVar.name}</span></p>

                        <div class="mb-4">
                            <div class="flex items-baseline gap-2">
                                <span id="price-${itemIdx}" class="text-2xl font-extrabold text-blue-700">
                                    ${currentVar.price}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span id="discount-${itemIdx}" class="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    ${currentVar.discount}
                                </span>
                                <span id="old-price-${itemIdx}" class="text-xs text-slate-400 line-through">
                                    ${currentVar.oldPrice}
                                </span>
                            </div>
                        </div>

                        <!-- LINGKARAN PILIHAN WARNA -->
                        <div class="mb-5">
                            <span class="text-xs text-slate-400 block mb-2 font-medium">Pilihan Warna:</span>
                            <div class="flex items-center gap-3">
                                ${item.variations.map((v, vIdx) => `
                                    <button 
                                        onclick="changeVariant(${itemIdx},${vIdx})"
                                        title="${v.name}"
                                        class="color-dot w-6 h-6 rounded-full border border-slate-300 focus:outline-none ${vIdx === item.activeVariantIndex ? 'active' : ''}"
                                        style="background-color: ${v.colorCode};">
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-5 pt-0 space-y-2">
                    <button onclick="previewTheme('${currentVar.name}', '${currentVar.image}')" 
                            class="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <i class="fa-regular fa-eye"></i> Lihat Tema
                    </button>
                    <a id="btn-order-${itemIdx}" 
                       href="${waUrl}" 
                       target="_blank"
                       class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                        <i class="fa-brands fa-whatsapp text-emerald-400 text-base"></i> Order
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// Fungsi ubah varian warna saat lingkaran diklik
function changeVariant(itemIndex, variantIndex) {
    katalogData[itemIndex].activeVariantIndex = variantIndex;
    const selectedVar = katalogData[itemIndex].variations[variantIndex];

    const imgEl = document.getElementById(`img-${itemIndex}`);
    if (imgEl) {
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
            imgEl.src = selectedVar.image;
            imgEl.style.opacity = '1';
        }, 150);
    }

    document.getElementById(`var-name-${itemIndex}`).textContent = selectedVar.name;
    document.getElementById(`price-${itemIndex}`).textContent = selectedVar.price;
    document.getElementById(`discount-${itemIndex}`).textContent = selectedVar.discount;
    document.getElementById(`old-price-${itemIndex}`).textContent = selectedVar.oldPrice;

    const waMessage = encodeURIComponent(`Halo Kak, saya mau pesan tema undangan: *${katalogData[itemIndex].title}* (Varian: *${selectedVar.name}*) harga ${selectedVar.price}`);
    document.getElementById(`btn-order-${itemIndex}`).href = `https://wa.me/${katalogData[itemIndex].waNumber}?text=${waMessage}`;

    renderKatalog();
}

function previewTheme(title, imgUrl) {
    alert(`Membuka preview untuk: ${title}`);
}

// Jalankan pengambilan data saat halaman dibuka
window.onload = function() {
    loadKatalogData();
};
