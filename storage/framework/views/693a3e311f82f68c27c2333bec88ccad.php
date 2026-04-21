<?php if (isset($component)) { $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54 = $attributes; } ?>
<?php $component = App\View\Components\AppLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('app-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\AppLayout::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    <div style="background: #f0f7ff; min-height: 100vh; padding: 1rem; font-family: 'Inter', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto;">
            
            <header style="text-align: center; margin-bottom: 2rem;">
                <h1 style="color: #1e3a8a; font-size: 1.75rem; font-weight: 800; margin: 0;">Panel de Entregas</h1>
                <p style="color: #3b82f6; font-size: 0.9rem; font-weight: 500;">Gestión de evidencias en tiempo real</p>
            </header>
            
            <?php if(session('status')): ?>
                <div style="background: #dbeafe; color: #1e40af; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #bfdbfe; font-weight: 600; text-align: center;">
                    <?php echo e(session('status')); ?>

                </div>
            <?php endif; ?>

            <?php if(session('error')): ?>
                <div style="background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #fecaca; font-weight: 600; text-align: center;">
                    <?php echo e(session('error')); ?>

                </div>
            <?php endif; ?>

            <!-- Formulario de Subida -->
            <div style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1); border: 1px solid #e0f2fe;">
                <form id="uploadForm" action="<?php echo e(route('evidencia.upload')); ?>" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <?php echo csrf_field(); ?>
                    
                    <div>
                        <label style="display: block; font-weight: 800; color: #1e40af; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">ID de Seguimiento</label>
                        <input type="text" name="tracking_id" required placeholder="Ingrese el número de guía" 
                            style="width: 100%; padding: 1rem; border: 2px solid #e0f2fe; border-radius: 12px; font-size: 1rem; box-sizing: border-box; background: #f8fafc; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#3b82f6'">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 800; color: #1e40af; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Descripción / Notas</label>
                        <textarea name="descripcion" rows="2" placeholder="Detalles adicionales..." 
                            style="width: 100%; padding: 1rem; border: 2px solid #e0f2fe; border-radius: 12px; font-size: 1rem; box-sizing: border-box; resize: none; background: #f8fafc; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#3b82f6'"></textarea>
                    </div>

                    <div>
                        <label style="display: block; font-weight: 800; color: #1e40af; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Capturar Evidencia</label>
                        <div style="position: relative; overflow: hidden;">
                            <input type="file" id="fileInput" accept="image/*" capture="environment" required 
                                style="width: 100%; padding: 0.75rem; font-size: 0.9rem; background: #eff6ff; border-radius: 12px; border: 2px dashed #bfdbfe; color: #2563eb; font-weight: 600;">
                        </div>
                        <input type="hidden" name="evidencia_comprimida" id="compressedImage">
                        <p style="color: #60a5fa; font-size: 0.75rem; margin-top: 0.5rem; font-weight: 500;">✨ La imagen será optimizada automáticamente.</p>
                    </div>

                    <div id="previewContainer" style="display: none; text-align: center; background: #f0f9ff; padding: 1rem; border-radius: 16px; border: 1px solid #bae6fd;">
                        <p style="font-size: 0.75rem; color: #0369a1; margin-bottom: 0.75rem; font-weight: 700; text-transform: uppercase;">Vista Previa Optimizada</p>
                        <img id="imagePreview" style="max-width: 100%; height: 250px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    </div>

                    <button type="submit" id="submitBtn" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 1.25rem; border: none; border-radius: 14px; font-weight: 800; font-size: 1.1rem; cursor: pointer; margin-top: 0.5rem; transition: all 0.3s; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);">
                        FINALIZAR Y ENVIAR
                    </button>
                </form>
            </div>

            <div style="margin-top: 3rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #1e40af; margin: 0; font-size: 1.25rem; font-weight: 800;">Historial Reciente</h2>
                    <form action="<?php echo e(route('dashboard')); ?>" method="GET" style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="date" name="fecha" value="<?php echo e(request('fecha')); ?>" 
                            style="padding: 0.5rem; border: 1px solid #bfdbfe; border-radius: 10px; font-size: 0.8rem; background: white; color: #1e40af;">
                        <button type="submit" style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.5rem 0.75rem; border-radius: 10px; cursor: pointer; font-size: 0.8rem; color: #2563eb; font-weight: 700;">VER</button>
                    </form>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <?php $__empty_1 = true; $__currentLoopData = $entregas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $entrega): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <div style="background: white; padding: 1rem; border-radius: 16px; border: 1px solid #e0f2fe; display: flex; align-items: center; gap: 1.25rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                            <div style="position: relative; width: 70px; height: 70px; border-radius: 12px; overflow: hidden; border: 2px solid #f0f9ff;">
                                <img src="<?php echo e($entrega->url_evidencia); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="flex-grow: 1;">
                                <p style="margin: 0; font-weight: 800; color: #1e3a8a; font-size: 1rem;">Guía: <?php echo e($entrega->tracking_id); ?></p>
                                <p style="margin: 0.25rem 0 0; font-size: 0.8rem; color: #60a5fa; font-weight: 600;"><?php echo e($entrega->created_at->format('d M, Y • H:i')); ?></p>
                            </div>
                            <div style="background: #dcfce7; color: #15803d; padding: 0.4rem 0.75rem; border-radius: 10px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">
                                LISTO
                            </div>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <div style="text-align: center; padding: 3rem 1rem; background: #f8fafc; border-radius: 20px; border: 2px dashed #e2e8f0;">
                            <p style="color: #94a3b8; font-style: italic; margin: 0; font-weight: 500;">No hay entregas para mostrar.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Script de Compresión en el Navegador -->
    <script>
        const fileInput = document.getElementById('fileInput');
        const compressedInput = document.getElementById('compressedImage');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const submitBtn = document.getElementById('submitBtn');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            submitBtn.disabled = true;
            submitBtn.style.background = '#94a3b8';
            submitBtn.style.boxShadow = 'none';
            submitBtn.innerText = 'PROCESANDO...';

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
                    compressedInput.value = compressedBase64;
                    
                    imagePreview.src = compressedBase64;
                    previewContainer.style.display = 'block';

                    submitBtn.disabled = false;
                    submitBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    submitBtn.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.4)';
                    submitBtn.innerText = 'FINALIZAR Y ENVIAR';
                };
            };
            reader.readAsDataURL(file);
        });
    </script>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $attributes = $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $component = $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php /**PATH /var/www/resources/views/dashboard.blade.php ENDPATH**/ ?>