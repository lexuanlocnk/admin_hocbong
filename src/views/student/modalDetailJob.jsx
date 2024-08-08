import React, { memo } from "react";
import { Modal, Table } from "antd";

function ModalDetailJob({ handleOpenModal, open, dataListJob, loading }) {
  const columns = [
    {
      title: "Tên bài viết",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "URL bài viết",
      dataIndex: "link",
      key: "link",

      render: (text) => {
        return (
          <a rel="noreferrer" target="_blank" href={text}>
            {text}
          </a>
        );
      },
    },
  ];

  return (
    <Modal
      width={1000}
      open={open.openModalDetail}
      title="Danh sách bài viết"
      onOk={() => handleOpenModal("openModalDetail", true, null)}
      onCancel={() => handleOpenModal("openModalDetail", false, null)}
      footer={null}
    >
      <div>
        <Table
          scroll={{ x: "max-content" }}
          loading={loading}
          dataSource={dataListJob?.listLink || []}
          columns={columns}
        />
      </div>
    </Modal>
  );
}

export default memo(ModalDetailJob);
