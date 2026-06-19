package lk.earth.earthuniversity.dao;


import lk.earth.earthuniversity.entity.Educationlevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationlevelDao extends JpaRepository<Educationlevel, Integer> {

    Educationlevel findByName(String name);
}