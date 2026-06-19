package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Announcement {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "title")
    private String title;
    @Basic
    @Column(name = "content")
    private String content;
    @Basic
    @Column(name = "isactive")
    private Byte isactive;
    @Basic
    @Column(name = "publishedat")
    private Timestamp publishedat;
    @Basic
    @Column(name = "expiredat")
    private Timestamp expiredat;

//    @JsonIgnore
//    @ManyToOne
//    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
//    private Employee employee;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "employee_id",referencedColumnName = "id", nullable = false)
    private Employee employee;

    public Announcement() {

    }
    public Announcement(Integer id, String title) {
        this.id = id;
        this.title = title;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Byte getIsactive() {
        return isactive;
    }

    public void setIsactive(Byte isactive) {
        this.isactive = isactive;
    }

    public Timestamp getPublishedat() {
        return publishedat;
    }

    public void setPublishedat(Timestamp publishedat) {
        this.publishedat = publishedat;
    }

    public Timestamp getExpiredat() {
        return expiredat;
    }

    public void setExpiredat(Timestamp expiredat) {
        this.expiredat = expiredat;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Announcement that = (Announcement) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(content, that.content) && Objects.equals(isactive, that.isactive) && Objects.equals(publishedat, that.publishedat) && Objects.equals(expiredat, that.expiredat);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, content, isactive, publishedat, expiredat);
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
