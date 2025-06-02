
const savedProducts = localStorage.getItem('productsMap');
const productsMap = new Map();
const uniquePrices = new Set();

const productNames = [
    "Торт 'Красный бархат'", "Шоколадный фондан", "Эклеры ванильные",
    "Чизкейк Нью-Йорк", "Макарун ассорти", "Тирамису классический",
    "Медовик", "Круассаны с миндалём", "Пирожное 'Картошка'",
    "Брауни с орехами", "Наполеон", "Пончики глазированные",
    "Пирог с вишней", "Трюфели шоколадные", "Панна-котта",
    "Кексы с черникой", "Печенье овсяное", "Безе ванильное",
    "Канноли с рикоттой", "Смородиновый чизкейк", "Рулет бисквитный",
    "Пирожные 'Корзинки'", "Зефир ванильный", "Пряники медовые",
    "Торт 'Птичье молоко'", "Эклеры шоколадные", "Крем-брюле",
    "Клубничный маффин", "Пирог яблочный", "Марципановые конфеты"
];

const imageUrls = [
    'https://img.iamcook.ru/2023/upl/recipes/zen/u-968ad71d1ca2f596e67e589c160a7038.jpg', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_eVQa9h5w_UM2qSZlzF04qiGdRllkkwMITg&s', 
    'https://bekkerjoy.ru/spree/products/1422/medium/IMG_4799.jpg?1655991320', 
    'https://art-lunch.ru/content/uploads/2014/08/cheesecake-new-york-001x2-1.jpg', 
    'https://cheese-cake.ru/DesertImg/makaruny-assorti-new-11.jpg', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5-eHiCPu6jKSg6Nso1w9i-zRDdIbhn_dJnQ&s', 
    'https://yasensvit.ua/uploads/recipes/prev/6463dc63a9a32.jpg', 
    'https://cheese-cake.ru/DesertImg/kruassan-otpechennyj-s-mindalem-i-mindalnym-kremom-2-0.jpg', 
    'https://cdn.lifehacker.ru/wp-content/uploads/2019/06/shutterstock_1469365640_1608978931-scaled-e1608978983722-630x315.jpg', 
    'https://eda.ru/images/RecipePhoto/960x960/brauni-s-orehami-pekan_124948_photo_147007.jpg', 
    'https://images.unian.net/photos/2020_07/thumb_files/1200_0_1594640431-9859.jpg', 
    'https://cdn-irec.r-99.com/sites/default/files/imagecache/300o/product-images/950467/xqQX591JsyAKUjRXbsk0Sg.jpg', 
    'https://gotovim-doma.ru/images/recipe/a/02/a02dd3d1d7cf2975962a6528affffb2b_l.jpg', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8gYZxv0dSXnyKdHhJ2tdZzUYUmcyRf59vMw&s', 
    'https://eda.ru/images/RecipePhoto/1x1/slivochno-vanilnaja-panna-kotta_32572_photo_16454.jpg', 
    'https://tilly.by/wp-content/uploads/2017/08/keksy-final1.jpg', 
    'https://miveoli.ru/image/cache/catalog/recipes/postnoe-ovsynoe-pechenie/oatmeal-cookies-1200x1200.jpg', 
    'https://img1.russianfood.com/dycontent/images_upl/652/big_651292.jpg', 
    'https://cooklikemary.ru/sites/default/files/styles/width_700/public/bez_imeni_1_iz_1-76_1.jpg?itok=L62d9exq', 
    'https://kamelena.com/uploads/recipes/500/507/f507-cheesecake-s-mussom-i-jele-iz-chernoj-smorodiny.jpg', 
    'https://ist.say7.info/img0006/26/626_016420a_3366_1024.jpg', 
    'https://puzzlefoods.ru/wa-data/public/shop/products/18/02/218/images/218/218.970.jpg', 
    'https://img.b2b.trade/d23acfe7-1af3-4417-bc4c-775851520171/-/smart_resize/500x500/-/quality/lightest/-/format/webp/', 
    'https://img1.russianfood.com/dycontent/images_upl/301/big_300638.jpg', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRkgvHRoOrNIWXKTGS9T6X3OtH2pTwtQ6VuA&s', 
    'https://www.vkusnyblog.com/wp-content/uploads/2015/11/eklery-s-maslyanym-kremom.jpg', 
    'https://cooking-img.nv.ua/cooking/recipe/13569/DgJdlu1sw5.webp?w=778', 
    'https://www.patee.ru/r/x6/03/af/20/960x.jpg', 
    'https://www.vkusnyblog.com/wp-content/uploads/2011/09/tsvetaevskiy-pirog-new.jpg', 
    'https://greenice.nethouse.ru/static/img/0000/0007/0380/70380949.g4stid1vqk.W665.JPG'  
];
productNames.forEach(() => {
   if (savedProducts) {
    const parsed = JSON.parse(savedProducts);
    parsed.forEach(([article, product]) => {
        productsMap.set(article, product);
        uniquePrices.add(product.price);
    });
} else {
    productNames.forEach((name, index) => {
        const price = (Math.random() * 9 + 1).toFixed(1).replace('.', ','); 

        const article = `ART-${1000 + index}`;

        const product = {
            name,
            price,
            image: imageUrls[index]
        };

        productsMap.set(article, product);
        uniquePrices.add(price);
    });

    const serialized = JSON.stringify(Array.from(productsMap.entries()));
    localStorage.setItem('productsMap', serialized);
}

});

const createPriceTable = () => {
    const tbody = document.querySelector('#priceTable tbody');
    tbody.innerHTML = '';
    
    productsMap.forEach((product, article) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${article}</td>
            <td class="price-cell">${product.price}</td>
        `;
        
        row.querySelector('.price-cell').addEventListener(
            'click', 
            showProductModal.bind(null, article)
        );
        
        tbody.appendChild(row);
    });
};

function showProductModal(article) {
    const product = productsMap.get(article);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const sizeSelect = document.getElementById('modalImageSize');
    
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalArticle').textContent = `Артикул: ${article}`;
    
    updateImageSize(sizeSelect.value);
    
    modal.style.display = 'block';  
    sizeSelect.addEventListener('change', (e) => {
        updateImageSize(e.target.value);
    });
}

function updateImageSize(size) {
    const img = document.getElementById('modalImage');
    if (!img) return;
    
    img.className = `product-image ${size}`;
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});
document.addEventListener('DOMContentLoaded', () => {
    createPriceTable();

});