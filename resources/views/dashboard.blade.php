<x-app-layout>
    <div style="background: #fdf2f8; min-height: 100vh; padding: 1rem; font-family: 'Montserrat', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto;">
            
            <header style="text-align: center; margin-bottom: 2rem;">
                <h1 style="color: #880e4f; font-size: 1.75rem; font-weight: 800; margin: 0;">Panel de Entregas</h1>
                <p style="color: #e91e63; font-size: 0.9rem; font-weight: 500;">Gestión de evidencias en tiempo real</p>
            </header>
            
            @if(session('status'))
                <div style="background: #f8bbd0; color: #880e4f; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #f48fb1; font-weight: 600; text-align: center;">
                    {{ session('status') }}
                </div>
            @endif

            @if(session('error'))
                <div style="background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #fecaca; font-weight: 600; text-align: center;">
                    {{ session('error') }}
                </div>
            @endif

            <!-- Formulario de Subida -->
            <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(233, 30, 99, 0.1); border: 1px solid #fce4ec;">
                <form id="uploadForm" action="{{ route('evidencia.upload') }}" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    @csrf
                    
                    <div>
                        <label style="display: block; font-weight: 800; color: #880e4f; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">ID de Seguimiento</label>
                        <input type="text" name="tracking_id" required placeholder="Ingrese el número de guía" 
                            style="width: 100%; padding: 1rem; border: 2px solid #fce4ec; border-radius: 12px; font-size: 1rem; box-sizing: border-box; background: #f8fafc; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#e91e63'">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 800; color: #880e4f; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Descripción / Notas</label>
                        <textarea name="descripcion" rows="2" placeholder="Detalles adicionales..." 
                            style="width: 100%; padding: 1rem; border: 2px solid #fce4ec; border-radius: 12px; font-size: 1rem; box-sizing: border-box; resize: none; background: #f8fafc; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#e91e63'"></textarea>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 800; color: #880e4f; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Capturar Evidencia</label>
                        <div style="position: relative; overflow: hidden;">
                            <input type="file" id="fileInput" accept="image/*" capture="environment" multiple required 
                                style="width: 100%; padding: 0.75rem; font-size: 0.9rem; background: #fce4ec; border-radius: 12px; border: 2px dashed #f48fb1; color: #e91e63; font-weight: 600;">
                        </div>
                        <div id="hiddenInputsContainer"></div>
                        <p style="color: #60a5fa; font-size: 0.75rem; margin-top: 0.5rem; font-weight: 500;">✨ La imagen será optimizada automáticamente.</p>
                    </div>

                    <div id="previewContainer" style="display: none; text-align: center; background: #fdf2f8; padding: 1rem; border-radius: 16px; border: 1px solid #f8bbd0;">
                        <p style="font-size: 0.75rem; color: #d81b60; margin-bottom: 0.75rem; font-weight: 700; text-transform: uppercase;">Vista Previa Optimizada</p>
                        <div id="imagePreviewContainer" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
                    </div>

                    <button type="submit" id="submitBtn" style="background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%); color: white; padding: 1.25rem; border: none; border-radius: 14px; font-weight: 800; font-size: 1.1rem; cursor: pointer; margin-top: 0.5rem; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(233, 30, 99, 0.4);">
                        FINALIZAR Y ENVIAR
                    </button>
                </form>
            </div>

            <div style="margin-top: 3rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #880e4f; margin: 0; font-size: 1.25rem; font-weight: 800;">Historial Reciente</h2>
                    <form action="{{ route('dashboard') }}" method="GET" style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="date" name="fecha" value="{{ request('fecha') }}" 
                            style="padding: 0.5rem; border: 1px solid #f48fb1; border-radius: 10px; font-size: 0.8rem; background: white; color: #880e4f;">
                        <button type="submit" style="background: #fce4ec; border: 1px solid #f48fb1; padding: 0.5rem 0.75rem; border-radius: 10px; cursor: pointer; font-size: 0.8rem; color: #e91e63; font-weight: 700;">VER</button>
                    </form>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    @forelse($entregas as $entrega)
                        <div style="background: white; padding: 1rem; border-radius: 16px; border: 1px solid #fce4ec; display: flex; align-items: center; gap: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                            <div style="position: relative; width: 70px; height: 70px; border-radius: 12px; overflow: hidden; border: 2px solid #fdf2f8; display: flex; align-items: center; justify-content: center; background: #fce4ec; color: #c2185b; font-weight: bold; font-size: 0.8rem;">
                                @if(is_array($entrega->url_evidencia) && count($entrega->url_evidencia) > 0)
                                    <img src="{{ $entrega->url_evidencia[0] }}" style="width: 100%; height: 100%; object-fit: cover;">
                                    @if(count($entrega->url_evidencia) > 1)
                                        <div style="position: absolute; bottom: 0; right: 0; background: rgba(0,0,0,0.6); color: white; padding: 2px 4px; font-size: 0.6rem; border-top-left-radius: 4px;">+{{ count($entrega->url_evidencia) - 1 }}</div>
                                    @endif
                                @else
                                    N/A
                                @endif
                            </div>
                            <div style="flex-grow: 1;">
                                <p style="margin: 0; font-weight: 800; color: #880e4f; font-size: 1rem;">Guía: {{ $entrega->tracking_id }}</p>
                                <p style="margin: 0.25rem 0 0; font-size: 0.8rem; color: #60a5fa; font-weight: 600;">{{ $entrega->created_at->format('d M, Y • H:i') }}</p>
                            </div>
                            <div style="background: #dcfce7; color: #15803d; padding: 0.4rem 0.75rem; border-radius: 10px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">
                                LISTO
                            </div>
                        </div>
                    @empty
                        <div style="text-align: center; padding: 3rem 1rem; background: #f8fafc; border-radius: 20px; border: 2px dashed #e2e8f0;">
                            <p style="color: #94a3b8; font-style: italic; margin: 0; font-weight: 500;">No hay entregas para mostrar.</p>
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>

    <!-- Script de Compresión en el Navegador -->
    <script>
        const fileInput = document.getElementById('fileInput');
        const hiddenInputsContainer = document.getElementById('hiddenInputsContainer');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const submitBtn = document.getElementById('submitBtn');

        fileInput.addEventListener('change', async function(e) {
            const files = e.target.files;
            if (files.length === 0) return;

            submitBtn.disabled = true;
            submitBtn.style.background = '#94a3b8';
            submitBtn.style.boxShadow = 'none';
            submitBtn.innerText = 'PROCESANDO...';

            hiddenInputsContainer.innerHTML = '';
            imagePreviewContainer.innerHTML = '';
            
            let processedCount = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        const MAX_WIDTH = 1200;
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                        
                        // Añadir input oculto
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'evidencias_comprimidas[]';
                        input.value = compressedBase64;
                        hiddenInputsContainer.appendChild(input);
                        
                        // Añadir a la vista previa
                        const imgPreview = document.createElement('img');
                        imgPreview.src = compressedBase64;
                        imgPreview.style.width = '100px';
                        imgPreview.style.height = '100px';
                        imgPreview.style.objectFit = 'cover';
                        imgPreview.style.borderRadius = '8px';
                        imgPreview.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                        imagePreviewContainer.appendChild(imgPreview);

                        processedCount++;
                        if (processedCount === files.length) {
                            previewContainer.style.display = 'block';
                            submitBtn.disabled = false;
                            submitBtn.style.background = 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)';
                            submitBtn.style.boxShadow = '0 10px 15px -3px rgba(233, 30, 99, 0.4)';
                            submitBtn.innerText = 'FINALIZAR Y ENVIAR';
                        }
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    </script>

    @include('components.gallery-modal')
</x-app-layout>
