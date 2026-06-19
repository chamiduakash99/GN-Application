package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictDao extends JpaRepository<District, Integer> {

    District findByName(String name);
}
