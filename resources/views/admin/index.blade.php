<x-app-layout>
    <div style="background: #fdf2f8; min-height: 100vh; padding: 2rem 0; font-family: 'Montserrat', sans-serif;">
        <div style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem;">
            
            <!-- Header Section -->
            <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 2rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h1 style="font-size: 2rem; font-weight: 800; color: #880e4f; margin: 0;">Registro de <span style="color: #e91e63;">Entregas</span></h1>
                        <p style="color: #64748b; margin-top: 0.5rem; font-size: 1rem;">Gestión centralizada y auditoría de evidencias.</p>
                    </div>
                    
                    <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.75rem; display: flex; gap: 2rem;">
                        <div style="text-align: center;">
                            <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Registros</p>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #e91e63;">{{ $entregas->total() }}</p>
                        </div>
                        <div style="width: 1px; background: #cbd5e1;"></div>
                        <div style="text-align: center;">
                            <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Repartidores</p>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #880e4f;">{{ $repartidores->count() }}</p>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f1f5f9;">
                    <form action="{{ route('admin.evidencias') }}" method="GET" style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">FILTRAR POR REPARTIDOR</label>
                            <select name="user_id" style="padding: 0.6rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background: white; min-width: 220px; font-size: 0.9rem;">
                                <option value="">Todos los usuarios</option>
                                @foreach($repartidores as $repartidor)
                                    <option value="{{ $repartidor->id }}" {{ request('user_id') == $repartidor->id ? 'selected' : '' }}>{{ $repartidor->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                            <label style="font-size: 0.75rem; font-weight: 700; color: #475569;">FECHA ESPECÍFICA</label>
                            <input type="date" name="fecha" value="{{ request('fecha') }}" 
                                style="padding: 0.6rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background: white; font-size: 0.9rem;">
                        </div>

                        <div style="margin-top: auto; display: flex; gap: 0.5rem;">
                            <button type="submit" style="background: #880e4f; color: white; padding: 0.6rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 700; cursor: pointer; transition: background 0.2s;">APLICAR FILTROS</button>
                            @if(request('user_id') || request('fecha'))
                                <a href="{{ route('admin.evidencias') }}" style="background: #f1f5f9; color: #475569; padding: 0.6rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; border: 1px solid #cbd5e1; font-size: 0.9rem;">Limpiar</a>
                            @endif
                        </div>
                    </form>
                </div>
            </div>

            <!-- Table Section -->
            <div style="background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; min-width: 1000px; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background: #fdf2f8; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Repartidor</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Tracking ID</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Descripción</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Evidencia</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Fecha y Hora</th>
                            <th style="padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody style="background: white;">
                        @forelse($entregas as $entrega)
                            <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s;" onmouseover="this.style.background='#fdf2f8'" onmouseout="this.style.background='white'">
                                <td style="padding: 1.25rem 1.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <div style="width: 36px; height: 36px; background: #fce4ec; color: #d81b60; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem;">
                                            {{ strtoupper(substr($entrega->user->name, 0, 1)) }}
                                        </div>
                                        <div>
                                            <p style="margin: 0; font-weight: 700; color: #880e4f; font-size: 0.95rem;">{{ $entrega->user->name }}</p>
                                            <p style="margin: 0; font-size: 0.75rem; color: #64748b;">{{ $entrega->user->email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <span style="background: #f1f5f9; color: #475569; padding: 0.3rem 0.6rem; border-radius: 0.4rem; font-family: monospace; font-weight: 700; font-size: 0.85rem; border: 1px solid #e2e8f0;">
                                        {{ $entrega->tracking_id }}
                                    </span>
                                </td>
                                <td style="padding: 1.25rem 1.5rem; max-width: 300px;">
                                    <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.4;">{{ $entrega->descripcion ?? 'N/A' }}</p>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    @if(is_array($entrega->url_evidencia) && count($entrega->url_evidencia) > 0)
                                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                            @foreach($entrega->url_evidencia as $url)
                                                <div style="position: relative; width: 40px; height: 40px; border-radius: 0.5rem; overflow: hidden; border: 2px solid #fff; box-shadow: 0 0 0 1px #e2e8f0; cursor: pointer;" onclick="openGallery({{ json_encode($entrega->url_evidencia) }}, {{ $loop->index }})">
                                                    <img src="{{ $url }}" style="width: 100%; height: 100%; object-fit: cover;">
                                                </div>
                                            @endforeach
                                        </div>
                                    @else
                                        <span style="color: #cbd5e1; font-style: italic; font-size: 0.8rem;">Sin foto</span>
                                    @endif
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    <p style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #880e4f;">{{ $entrega->created_at->format('d/m/Y') }}</p>
                                    <p style="margin: 0; font-size: 0.75rem; color: #64748b;">{{ $entrega->created_at->format('H:i:s') }}</p>
                                </td>
                                <td style="padding: 1.25rem 1.5rem;">
                                    @if(is_array($entrega->url_evidencia) && count($entrega->url_evidencia) > 0)
                                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                            <a href="#" onclick="event.preventDefault(); openGallery({{ json_encode($entrega->url_evidencia) }}, 0)" style="background: #f1f5f9; color: #880e4f; padding: 0.4rem 0.8rem; border-radius: 0.4rem; text-decoration: none; font-size: 0.75rem; font-weight: 700; border: 1px solid #cbd5e1; text-align: center;">VER TODAS</a>
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" style="padding: 5rem; text-align: center; color: #94a3b8; font-style: italic;">No hay registros que coincidan con la búsqueda.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
                
                <!-- Pagination Footer -->
                <div style="background: #fdf2f8; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0;">
                    {{ $entregas->appends(request()->input())->links() }}
                </div>
            </div>
        </div>
    </div>

    @include('components.gallery-modal')
</x-app-layout>
