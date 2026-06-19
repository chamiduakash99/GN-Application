package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Streetmatierial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreetmatierialDao extends JpaRepository<Streetmatierial, Integer> {
}
