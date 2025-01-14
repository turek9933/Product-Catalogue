FROM minio/minio:RELEASE.2024-12-18T13-15-44Z.fips

COPY init.sh /usr/bin/init.sh
RUN chmod +x /usr/bin/init.sh

ENTRYPOINT ["/bin/sh", "-c", "/usr/bin/init.sh && minio $@"]