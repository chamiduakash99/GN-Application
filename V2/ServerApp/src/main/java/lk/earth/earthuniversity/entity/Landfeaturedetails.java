package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Landfeaturedetails {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @ManyToOne
    @JoinColumn(name = "landfeature_id", referencedColumnName = "id", nullable = false)
    private Landfeature landfeature;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "land_id", referencedColumnName = "id", nullable = false)
    private Land land;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Landfeaturedetails that = (Landfeaturedetails) o;

        if (id != that.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id;
    }

    public Landfeature getLandfeature() {
        return landfeature;
    }

    public void setLandfeature(Landfeature landfeature) {
        this.landfeature = landfeature;
    }

    public Land getLand() {
        return land;
    }

    public void setLand(Land land) {
        this.land = land;
    }
}
