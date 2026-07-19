package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Croptype {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "growthperioddays")
    private Integer growthperioddays;

    @Basic
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "croptype")
    private Collection<Cultivation> cultivations;

    public Croptype() {}

    public Croptype(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getGrowthperioddays() { return growthperioddays; }
    public void setGrowthperioddays(Integer growthperioddays) { this.growthperioddays = growthperioddays; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Collection<Cultivation> getCultivations() { return cultivations; }
    public void setCultivations(Collection<Cultivation> cultivations) { this.cultivations = cultivations; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Croptype that = (Croptype) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() { return Objects.hash(id, name); }
}