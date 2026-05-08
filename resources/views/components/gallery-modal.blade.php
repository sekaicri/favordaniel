<!-- Gallery Modal Component with Liquid Glass Effect -->
<div id="galleryModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); z-index: 9999; justify-content: center; align-items: center; backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); transition: all 0.3s ease;">
    
    <!-- Botón Cerrar (Estilo Glass) -->
    <button onclick="closeGallery()" style="position: absolute; top: 2rem; right: 2rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; font-size: 2rem; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; backdrop-filter: blur(4px); box-shadow: 0 4px 15px rgba(0,0,0,0.2);" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='scale(1)'">&times;</button>

    <!-- Contenedor Principal Glass -->
    <div style="position: relative; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 1rem; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); max-width: 90%; max-height: 85vh; display: flex; align-items: center; justify-content: center;">
        
        <!-- Botón Anterior -->
        <button onclick="prevImage()" id="btnPrevImg" style="position: absolute; left: -2rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; font-size: 1.5rem; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; backdrop-filter: blur(4px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.left='-2.2rem'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.left='-2rem'">&#10094;</button>

        <!-- Imagen con borde sutil -->
        <div style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
            <img id="galleryImage" src="" style="max-width: 100%; max-height: 75vh; object-fit: contain; display: block; background: rgba(0,0,0,0.2);">
        </div>

        <!-- Botón Siguiente -->
        <button onclick="nextImage()" id="btnNextImg" style="position: absolute; right: -2rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; font-size: 1.5rem; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; backdrop-filter: blur(4px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.right='-2.2rem'" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.right='-2rem'">&#10095;</button>
    </div>

    <!-- Indicador y Acción (Estilo Glass) -->
    <div style="position: absolute; bottom: 2rem; display: flex; flex-direction: column; align-items: center; gap: 0.8rem;">
        <span id="galleryCounter" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.05em; backdrop-filter: blur(4px);"></span>
        <a id="galleryDownload" href="" download style="background: rgba(233, 30, 99, 0.2); border: 1px solid rgba(233, 30, 99, 0.4); color: white; padding: 0.6rem 2rem; border-radius: 12px; text-decoration: none; font-size: 0.9rem; font-weight: 700; box-shadow: 0 4px 15px rgba(233, 30, 99, 0.2); backdrop-filter: blur(8px); transition: all 0.3s;" onmouseover="this.style.background='rgba(233, 30, 99, 0.4)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(233, 30, 99, 0.2)'; this.style.transform='translateY(0)'">Descargar Imagen</a>
    </div>
</div>

<script>
    let currentGalleryImages = [];
    let currentGalleryIndex = 0;

    function openGallery(images, startIndex) {
        currentGalleryImages = images;
        currentGalleryIndex = startIndex;
        
        document.getElementById('galleryModal').style.display = 'flex';
        updateGalleryView();
        
        // Bloquear scroll de la página
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        document.getElementById('galleryModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function prevImage() {
        if (currentGalleryIndex > 0) {
            currentGalleryIndex--;
            updateGalleryView();
        } else {
            currentGalleryIndex = currentGalleryImages.length - 1; // loop
            updateGalleryView();
        }
    }

    function nextImage() {
        if (currentGalleryIndex < currentGalleryImages.length - 1) {
            currentGalleryIndex++;
            updateGalleryView();
        } else {
            currentGalleryIndex = 0; // loop
            updateGalleryView();
        }
    }

    function updateGalleryView() {
        const imgElement = document.getElementById('galleryImage');
        const counterElement = document.getElementById('galleryCounter');
        const downloadElement = document.getElementById('galleryDownload');
        const btnPrev = document.getElementById('btnPrevImg');
        const btnNext = document.getElementById('btnNextImg');

        imgElement.src = currentGalleryImages[currentGalleryIndex];
        downloadElement.href = currentGalleryImages[currentGalleryIndex];
        counterElement.innerText = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;

        // Mostrar u ocultar controles si solo hay 1 imagen
        if (currentGalleryImages.length <= 1) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        } else {
            btnPrev.style.display = 'flex';
            btnNext.style.display = 'flex';
        }
    }

    // Cerrar al hacer clic fuera de la imagen
    document.getElementById('galleryModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGallery();
        }
    });

    // Soporte para flechas del teclado
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('galleryModal').style.display === 'flex') {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeGallery();
        }
    });
</script>
