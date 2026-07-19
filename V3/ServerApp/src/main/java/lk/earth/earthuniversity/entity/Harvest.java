package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Objects;

@Entity
public class Harvest {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "harvestdate")
    private Date harvestdate;

    @Basic
    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal quantity;

    @Basic
    @Column(name = "qualityremarks", columnDefinition = "TEXT")
    private String qualityremarks;

    @ManyToOne
    @JoinColumn(name = "cultivation_id", referencedColumnName = "id", nullable = false)
    private Cultivation cultivation;

    public Harvest() {}

    public Harvest(Integer id, Date harvestdate, BigDecimal quantity) {
        this.id = id;
        this.harvestdate = harvestdate;
        this.quantity = quantity;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Date getHarvestdate() { return harvestdate; }
    public void setHarvestdate(Date harvestdate) { this.harvestdate = harvestdate; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getQualityremarks() { return qualityremarks; }
    public void setQualityremarks(String qualityremarks) { this.qualityremarks = qualityremarks; }

    public Cultivation getCultivation() { return cultivation; }
    public void setCultivation(Cultivation cultivation) { this.cultivation = cultivation; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Harvest that = (Harvest) o;
        return Objects.equals(id, that.id) && Objects.equals(harvestdate, that.harvestdate) &&
                Objects.equals(quantity, that.quantity);
    }

    @Override
    public int hashCode() { return Objects.hash(id, harvestdate, quantity); }
}