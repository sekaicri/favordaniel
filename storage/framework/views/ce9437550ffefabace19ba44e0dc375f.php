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
    <div style="background: #f8fafc; min-height: 100vh; padding: 2rem 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem;">
            
            <!-- Header Section -->
            <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 2rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h1 style="font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0;">Registro de <span style="color: #2563eb;">Entregas</span></h1>
                        <p style="color: #64748b; margin-top: 0.5rem; font-size: 1rem;">Gestión centralizada y auditoría de evidencias.</p>
                    </div>
                    
                    <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.75rem; display: flex; gap: 2rem;">
                        <div style="text-align: center;">
                            <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Registros</p>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #2563eb;"><?php echo e($entregas->total()); ?></p>
                        </div>
                        <div style="width: 1px; background: #cbd5e1;"></div>
                        <div style="text-align: center;">
                            <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Repartidores</p>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #1e293b;"><?php echo e($repartidores->count()); ?></p>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f1f5f9;">
                    <form action="<?php echo e(route('admin.evidencias')); ?>" method="GET" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">FILTRAR POR REPARTIDOR</label>
                            <select name="user_id" style="padding: 0.6rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background: white; min-width: 220px; font-size: 0.9rem;">
                                <option value="">Todos los usuarios</option>
                                <?php $__currentLoopData = $repartidores; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $repartidor): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <option value="<?php echo e($repartidor->id); ?>" <?php echo e(request('user_id') == $repartidor->id ? 'selected' : ''); ?>><?php echo e($repartidor->name); ?></option>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </select>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">FECHA ESPECÍFICA</label>
                            <input type="date" name="fecha" value="<?php echo e(request('fecha')); ?>" 
                                style="padding: 0.6rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background: white; font-size: 0.9rem;">
                        </div>

                        <div style="margin-top: auto; display: flex; gap: 0.5rem;">
                            <button type="submit" style="background: #1e293b; color: white; padding: 0.6rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 700; cursor: pointer; transition: background 0.2s;">APLICAR FILTROS</button>
                            <?php if(request('user_id') || request('fecha')): ?>
                                <a href="<?php echo e(route('admin.evidencias')); ?>" style="background: #f1f5f9; color: #475569; padding: 0.6rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; border: 1px solid #cbd5e1; font-size: 0.9rem;">Limpiar</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Table Section -->
            <div style="background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; min-width: 1000px; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Repartidor</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Tracking ID</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Descripción</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Evidencia</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Fecha y Hora</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody style="background: white;">
                        <?php $__empty_1 = true; $__currentLoopData = $entregas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $entrega): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                                <td style="padding: 1.25rem 1.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <div style="width: 36px; height: 36px; background: #e0e7ff; color: #4338ca; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem;">
                                            <?php echo e(strtoupper(substr($entrega->user->name, 0, 1))); ?>

                                        </div>
                                        <div>
                                            <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: 0.95rem;"><?php echo e($entrega->user->name); ?></p>
                                            <p style="margin: 0; font-size: 0.75rem; color: #64748b;"><?php echo e($entrega->user->email); ?></p>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <span style="background: #f1f5f9; color: #475569; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-family: monospace; font-weight: 700; font-size: 0.85rem; border: 1px solid #e2e8f0;">
                                        <?php echo e($entrega->tracking_id); ?>

                                    </span>
                                </td>
                                <td style="padding: 1.25rem 1.5rem; max-width: 300px;">
                                    <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.4;"><?php echo e($entrega->descripcion ?? 'N/A'); ?></p>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <?php if($entrega->url_evidencia): ?>
                                        <div style="position: relative; width: 60px; height: 60px; border-radius: 0.5rem; overflow: hidden; border: 2px solid #fff; box-shadow: 0 0 0 1px #e2e8f0; cursor: pointer;" onclick="window.open('<?php echo e($entrega->url_evidencia); ?>', '_blank')">
                                            <img src="<?php echo e($entrega->url_evidencia); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    <?php else: ?>
                                        <span style="color: #cbd5e1; font-style: italic; font-size: 0.8rem;">Sin foto</span>
                                    <?php endif; ?>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <p style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #1e293b;"><?php echo e($entrega->created_at->format('d/m/Y')); ?></p>
                                    <p style="margin: 0; font-size: 0.75rem; color: #64748b;"><?php echo e($entrega->created_at->format('H:i:s')); ?></p>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <div style="display: flex; gap: 0.5rem;">
                                        <a href="<?php echo e($entrega->url_evidencia); ?>" target="_blank" style="background: #f1f5f9; color: #1e293b; padding: 0.4rem 0.8rem; border-radius: 0.4rem; text-decoration: none; font-size: 0.75rem; font-weight: 700; border: 1px solid #cbd5e1;">VER</a>
                                        <a href="<?php echo e($entrega->url_evidencia); ?>" download style="background: #2563eb; color: white; padding: 0.4rem 0.8rem; border-radius: 0.4rem; text-decoration: none; font-size: 0.75rem; font-weight: 700;">BAJAR</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <tr>
                                <td colspan="6" style="padding: 5rem; text-align: center; color: #94a3b8; font-style: italic;">No hay registros que coincidan con la búsqueda.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
                
                <!-- Pagination Footer -->
                <div style="background: #f8fafc; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0;">
                    <?php echo e($entregas->appends(request()->input())->links()); ?>

                </div>
            </div>
        </div>
    </div>
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
<?php /**PATH /var/www/resources/views/admin/index.blade.php ENDPATH**/ ?>