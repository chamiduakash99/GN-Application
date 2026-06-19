package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "landfeature_has_landdetail", schema = "gramaniladharidb", catalog = "")
public class LandfeatureHasLanddetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "landfeature_id", referencedColumnName = "id", nullable = false)
    private Landfeature landfeature;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "landDetail_id", referencedColumnName = "id", nullable = false)
    private Landdetail landdetail;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LandfeatureHasLanddetail that = (LandfeatureHasLanddetail) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Landfeature getLandfeature() {
        return landfeature;
    }

    public void setLandfeature(Landfeature landfeatureByLandfeatureId) {
        this.landfeature = landfeatureByLandfeatureId;
    }

    public Landdetail getLanddetail() {
        return landdetail;
    }

    public void setLanddetail(Landdetail landdetail) {
        this.landdetail = landdetail;
    }
}
