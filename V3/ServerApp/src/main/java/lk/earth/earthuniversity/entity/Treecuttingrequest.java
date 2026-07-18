package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Treepermissionstatus {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "name")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "treepermissionstatus")
    private Collection<Treecuttingrequest> treecuttingrequests;

    public Treepermissionstatus() {}

    public Treepermissionstatus(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Treepermissionstatus that = (Treepermissionstatus) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() { return Objects.hash(id, name); }

    public Collection<Treecuttingrequest> getTreecuttingrequests() { return treecuttingrequests; }
    public void setTreecuttingrequests(Collection<Treecuttingrequest> t) { this.treecuttingrequests = t; }
}