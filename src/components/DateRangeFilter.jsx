import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";

/**
 * Filtro reutilizable de rango de fechas (desde / hasta).
 * Pensado para usarse dentro del contenedor de búsqueda (`search-container`),
 * junto a la barra de búsqueda, manteniendo la coherencia visual del sistema.
 */
export default function DateRangeFilter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  labelFrom = "Desde",
  labelTo = "Hasta",
}) {
  const hasFilter = dateFrom !== "" || dateTo !== "";

  const handleClear = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <>
      <Form.Group className="filter-form-group">
        <Form.Label>
          <FaCalendarAlt /> {labelFrom}
        </Form.Label>
        <Form.Control
          type="date"
          value={dateFrom}
          // El límite máximo evita elegir un "desde" posterior al "hasta"
          max={dateTo || undefined}
          onChange={(e) => setDateFrom(e.target.value)}
          className="search-input"
        />
      </Form.Group>

      <Form.Group className="filter-form-group">
        <Form.Label>
          <FaCalendarAlt /> {labelTo}
        </Form.Label>
        <Form.Control
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => setDateTo(e.target.value)}
          className="search-input"
        />
      </Form.Group>

      {hasFilter && (
        <div className="filter-clear-group">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-clear-dates">Limpiar fechas</Tooltip>}
          >
            <Button variant="secondary" onClick={handleClear}>
              <FaTimes />
            </Button>
          </OverlayTrigger>
        </div>
      )}
    </>
  );
}
